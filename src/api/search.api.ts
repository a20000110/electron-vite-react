import { request } from '@/lib/request'
import { ComprehensiveSearchRequest } from '@/type/api/search'

export const SearchApi = {
  /**
   * 综合搜索
   */
  comprehensive: (params: ComprehensiveSearchRequest) => {
    return request({
      url: '/search/comprehensive',
      method: 'GET',
      params,
    })
  },
}
