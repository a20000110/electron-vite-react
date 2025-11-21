import { describe, it, expect } from 'vitest'
import { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from 'axios'
import { createHttpClient } from '../src/lib/request'

function makeAdapter(handler: (config: AxiosRequestConfig) => Promise<AxiosResponse>): AxiosAdapter {
  return async (config) => handler(config)
}

describe('http 拦截器功能', () => {
  // 使用真实计时器，避免假定计时器与 axios 内部调度不一致导致超时

  it('并发控制：同时仅运行限定数量的请求', async () => {
    const max = 2
    let current = 0
    let peak = 0

    const instance = createHttpClient({ concurrency: { maxConcurrency: max } })

    instance.defaults.adapter = makeAdapter(async (config) => {
      if (config.signal?.aborted) {
        return Promise.reject({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config })
      }
      current++
      peak = Math.max(peak, current)
      await new Promise((res, rej) => {
        const onAbort = () => rej({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config })
        if (config.signal) config.signal.addEventListener('abort', onAbort, { once: true })
        setTimeout(() => {
          if (config.signal) config.signal.removeEventListener('abort', onAbort)
          res(undefined)
        }, 100)
      })
      current--
      return { data: config.url, status: 200, statusText: 'OK', headers: {}, config }
    })

    const reqs = Array.from({ length: 6 }).map((_, i) => instance.get(`/concurrency-${i}`))
    await Promise.all(reqs)
    expect(peak).toBe(max)
  })

  it('失败重试：5xx 错误自动重试并最终成功', async () => {
    const instance = createHttpClient({ retry: { retries: 3, retryDelay: 200 } })

    const calls: Record<string, number> = {}
    instance.defaults.adapter = makeAdapter(async (config) => {
      if (config.signal?.aborted) {
        return Promise.reject({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config })
      }
      const key = String(config.url)
      calls[key] = (calls[key] || 0) + 1
      const attempt = calls[key]
      if (key === '/retry' && attempt < 3) {
        return Promise.reject({
          isAxiosError: true,
          response: { status: 500, statusText: 'ERR', headers: {}, data: null, config },
          config
        })
      }
      return { data: { ok: true, attempt }, status: 200, statusText: 'OK', headers: {}, config }
    })

    const res = await instance.get('/retry')
    expect(res.data.ok).toBe(true)
    expect(res.data.attempt).toBe(3)
  })

  it('相同 URL 去重：后发请求取消前一个', async () => {
    const instance = createHttpClient()

    instance.defaults.adapter = makeAdapter(async (config) => {
      if (config.signal?.aborted) {
        return Promise.reject({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config })
      }
      await new Promise((res, rej) => {
        const onAbort = () => rej({ isAxiosError: true, code: 'ERR_CANCELED', message: 'canceled', config })
        if (config.signal) config.signal.addEventListener('abort', onAbort, { once: true })
        setTimeout(() => {
          if (config.signal) config.signal.removeEventListener('abort', onAbort)
          res(undefined)
        }, 200)
      })
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }
    })

    const first = instance.get('/dup')
    const second = instance.get('/dup')

    await expect(first).rejects.toMatchObject({ code: 'ERR_CANCELED' })
    const res2 = await second
    expect(res2.status).toBe(200)
  })
})