import axios from '@/libs/api_request'

export const common_button_list = (params) => {
  return axios.get('button_cn_en/list', params)
}
