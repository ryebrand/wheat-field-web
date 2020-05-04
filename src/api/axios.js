import axios from 'axios'
axios.defaults.timeout = 20000
axios.defaults.headers.post['Content-Type'] = 'application/x-www=form-urlencoded'
// axios.defaults.baseURL = 'http://47.95.249.44:80'
axios.defaults.baseURL = 'http://127.0.0.1:8090'

// 请求拦截
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // let tmpCode = parseInt(response.data.code, 10)
    // response.data['success'] = (!isNaN(tmpCode) && tmpCode === 0)
    // if (response.status === 200 && !response.data.success) {
    //   // 抽出 message,统一 message 的结构层次，以便于统一提示消息.
    //   response.message = response.data.msg
    //   return Promise.reject(response)
    // }
    return response
  }, function (error) {
    // Do something with response error
    // if (!error.response.status || error.response.status === 403 || error.response.status === 401) {
    //   router.push({
    //     name: 'Login'
    //   })
    // } else {
    return Promise.reject(error)
    // }
  }
)
export default axios
