import axios from './axios'
import { getStore } from '/utils/storage'
export default {
  fetchGet (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.defaults.headers['Authorization'] = getStore('token')
      axios.get(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  fetchPost (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.defaults.headers['Authorization'] = getStore('token')
      axios.post(url, params).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}


