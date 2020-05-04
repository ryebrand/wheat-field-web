import axios from './axios'
import qs from 'qs'
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
  },
  fetchPostFrom (url, params = {}) {
    return new Promise((resolve, reject) => {
      axios.defaults.headers['Authorization'] = getStore('token')
      axios.post(url, qs.stringify(params), {headers: {'Content-Type':'application/x-www-form-urlencoded'}}).then(res => {
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}


