// 商品列表：筛选条件 + 分页 + 列表数据（列表/检索页用，规范 §8.5 URL 同步由页面处理）
import { defineStore } from 'pinia'
import goodsApi from '@/api/goods'

export const useGoodsStore = defineStore('goods', {
  state: () => ({
    list: [],
    total: 0,
    page: 1,
    pageSize: 12, // 列表页默认每页 12 条（规范 §8.5）
    loading: false,
    filters: {
      keyword: '',
      category: '',
      condition: '',
      minPrice: null, // 分
      maxPrice: null, // 分
      sort: 'latest'
    }
  }),

  actions: {
    /** 设置筛选条件（部分更新），并回到第 1 页 */
    setFilters(patch) {
      this.filters = { ...this.filters, ...patch }
      this.page = 1
    },

    /** 翻页 */
    setPage(page) {
      this.page = page
    },

    /** 拉取列表（按当前筛选 + 分页），返回 data 供页面做 URL 同步等 */
    async fetchList() {
      this.loading = true
      try {
        const data = await goodsApi.getList({
          ...this.filters,
          page: this.page,
          // 后端 ProductQueryDTO 分页参数为 size（联调核对，步骤 9；响应仍是 pageSize）
          size: this.pageSize
        })
        this.list = data.list || []
        this.total = data.total || 0
        return data
      } finally {
        this.loading = false
      }
    },

    /** 清空筛选 */
    resetFilters() {
      this.filters = { keyword: '', category: '', condition: '', minPrice: null, maxPrice: null, sort: 'latest' }
      this.page = 1
    }
  }
})
