import axios, { AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import qs from 'qs'
import { toast } from 'sonner'

const RetryConfig = {
  TIMEOUT: 10, // 重试请求重试最大次数
  FAIL: 10, // 错误响应请求最大次数
}

// 定义请求配置接口，扩展自InternalAxiosRequestConfig
export interface AdditionalRequestConfig {
  failRetry?: number // 开启接口错误重试
  mock?: string //是否开启mock,传递mock json的文件名称
  timeoutRetry?: number // 开启接口超时重试
  repatCancel?: boolean // 开启取消重复请求 (同options 取消请求)
  cancelByUrl?: boolean // 是否根据url取消重复请求 (默认根据method + url 取消)
  fullLoading?: boolean // 请求时是否开启全屏loading
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export interface RequestConfig extends InternalAxiosRequestConfig, AdditionalRequestConfig {
  headers?: Record<string, string>
}

// 定义Http服务类
class HttpService {
  // 单例模式实现
  private static instance: HttpService
  // axios实例
  private service: AxiosInstance | null = null
  // 存储待处理请求的Map
  private pendingMap: Map<string, AbortController>
  // 最大并发请求数
  private maxConcurrent: number = 50
  // 当前执行中的请求数
  private currentRequests: number = 0
  // 等待队列
  private requestQueue: Array<{
    config: RequestConfig
    resolve: (value: any) => void
    reject: (reason?: any) => void
  }> = []

  // 私有构造函数，防止外部实例化
  private constructor() {
    this.pendingMap = new Map()
    // 初始化axios默认配置
    this.initAxiosDefaults()
    // 初始化axios实例
    this.initAxiosInstance()
    // 设置拦截器
    this.setupInterceptors()
  }

  // 单例获取实例方法
  public static getInstance(): HttpService {
    if (!HttpService.instance) {
      HttpService.instance = new HttpService()
    }
    return HttpService.instance
  }

  // 初始化axios默认配置
  private initAxiosDefaults(): void {
    axios.defaults.transformResponse = [
      (data: unknown) => {
        return data
      },
    ]
  }

  // 初始化axios实例
  private initAxiosInstance(): void {
    this.service = axios.create({
      baseURL: 'https://kg-music.hhchen.cn',
      timeout: 30000,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })
  }

  // 生成请求唯一键
  private getPendingKey(config: RequestConfig): string {
    const { url, method, params, data, cancelByUrl } = config as RequestConfig & {
      cancelByUrl?: boolean
    }
    const normalizedUrl = (url ?? '').split('?')[0]
    if (cancelByUrl) {
      return [normalizedUrl, method].join('&')
    }
    return [url, method, qs.stringify(params), qs.stringify(data)].join('&')
  }

  // 添加待处理请求
  private addPending(config: RequestConfig): void {
    if (config?.repatCancel || config?.cancelByUrl) {
      const pendingKey = this.getPendingKey(config)
      const controller = new AbortController()
      config.signal = controller.signal

      if (this.pendingMap.has(pendingKey)) {
        this.pendingMap.get(pendingKey)?.abort()
        this.pendingMap.delete(pendingKey)
      }
      this.pendingMap.set(pendingKey, controller)
    }
  }

  // 移除待处理请求
  private removePending(config: RequestConfig): void {
    if (config?.repatCancel || config?.cancelByUrl) {
      const pendingKey = this.getPendingKey(config)
      this.pendingMap.delete(pendingKey)
    }
  }

  // 设置拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.service?.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.addPending(config)
        if (!config?.headers?.['Content-Type']) {
          config.headers['Content-Type'] = 'application/json;charset=utf-8'
        }
        return config
      },
      (error: unknown) => Promise.reject(error)
    )

    // 响应拦截器
    this.service?.interceptors.response.use(
      async (response: AxiosResponse) => {
        const config = response.config as AdditionalRequestConfig

        const mock = config.mock

        this.removePending(config)
        if (
          response.request.responseType === 'blob' ||
          response.request.responseType === 'arraybuffer'
        ) {
          return response
        }

        if (mock && import.meta.env.DEV) {
          const data = (await import(`@/mock/${mock}.ts`)).default()
          if (mock?.endsWith('List') || mock?.endsWith('list')) {
            const listData = {
              list: data,
              total: Math.floor(Math.random() * 1000),
              pageNum: 1,
              pageSize: 20,
              startPos: 1,
            }
            console.log(listData, `mock ========= ${mock}`)
            return listData
          } else {
            console.log(data, `mock ========= ${mock}`)
            return data
          }
        }

        const { status, data, errorCode, error_msg } = response.data || {}

        if (status === 1 && (errorCode === 0 || errorCode === undefined || errorCode === null)) {
          return data
        }

        toast.error(error_msg || '系统出错')
        return Promise.reject(response.data)
      },
      async (error: any) => {
        console.error('request error', error)
        let { message } = error
        const { config } = error

        // 请求失败重试
        if (!message.includes('timeout') && config?.failRetry > 0) {
          if (config.failRetry > RetryConfig.FAIL) {
            config.failRetry = RetryConfig.FAIL
          }
          config.failRetry--
          console.log(`接口请求失败，正在进行第${RetryConfig.FAIL - config.failRetry}次重试`)
          return this.service?.(config)
        }

        // 接口超时重试
        if (message.includes('timeout') && config?.timeoutRetry > 0) {
          if (config.timeoutRetry > RetryConfig.TIMEOUT) {
            config.timeoutRetry = RetryConfig.TIMEOUT
          }
          config.timeoutRetry--
          console.log(`请求超时，正在进行第${RetryConfig.TIMEOUT - config.timeoutRetry}次重试`)
          return this.service?.(config)
        }

        if (message === 'Network Error') {
          message = '后端接口连接异常'
        } else if (message.includes('timeout')) {
          message = '系统接口请求超时'
        } else if (message.includes('Request failed with status code')) {
          message = '系统接口' + message.substr(message.length - 3) + '异常'
        } else if (message === 'canceled') {
          return
        }
        toast.error(message || '系统出错')
        return Promise.reject(error)
      }
    )
  }

  // 取消所有待处理请求
  public cancelAllPendingRequests(whiteList: string[] = []): void {
    console.log(this.pendingMap)
    this.pendingMap.forEach((controller, key) => {
      const urlMatch = key.split('&')[0]
      console.log(urlMatch)
      const isWhitelisted = whiteList.some(path => urlMatch.includes(path))
      if (!isWhitelisted) {
        controller.abort()
        this.pendingMap.delete(key)
      }
    })
  }

  // 发起请求
  public request<T = any>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      if (this.currentRequests < this.maxConcurrent) {
        this.executeRequest(config, resolve, reject)
      } else {
        this.requestQueue.push({ config, resolve, reject })
      }
    })
  }

  // 执行请求
  private executeRequest<T = any>(
    config: RequestConfig,
    resolve: (value: T) => void,
    reject: (reason?: any) => void
  ): void {
    this.currentRequests++
    const svc = this.service
    if (!svc) {
      this.currentRequests--
      this.checkQueue()
      return
    }
    svc(config)
      .then((response: any) => {
        resolve(response as T)
      })
      .catch((error: any) => {
        reject(error)
      })
      .finally(() => {
        this.currentRequests--
        this.checkQueue()
      })
  }

  // 检查队列
  private checkQueue(): void {
    if (this.requestQueue.length > 0 && this.currentRequests < this.maxConcurrent) {
      const queue = this.requestQueue.shift()
      if (!queue) return
      const { config, resolve, reject } = queue
      this.executeRequest(config, resolve, reject)
    }
  }

  // 设置最大并发数
  public setMaxConcurrent(max: number): void {
    this.maxConcurrent = max
  }
}

// 创建Http服务实例
const httpService = HttpService.getInstance()
export const request = httpService.request.bind(httpService)
// 取消所有待响应请求
export const cancelAllPendingRequests = httpService.cancelAllPendingRequests.bind(httpService)
export default httpService
