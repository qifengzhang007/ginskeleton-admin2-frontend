import axios from '@/libs/api_request'

export const uploadFiles = (data) => {
  return axios.post('/upload/files', data)
}