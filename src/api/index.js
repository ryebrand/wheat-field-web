import http from './public'
// 登陆
export const userLogin = (params) => {
  return http.fetchPost('/user/login', params)
}
// 退出登陆 服务端没有************
export const loginOut = (params) => {
  return http.fetchGet('/member/loginOut', params)
}
// 用户信息 服务端没有************
export const userInfo = (params) => {
  return http.fetchPost('/user/getInfo', params)
}
// 注册账号
export const register = (params) => {
  return http.fetchPost('/user/register', params)
}
// 上传图片
export const upload = (params) => {
  // return http.fetchPost('/member/imgaeUpload', params)
  return http.fetchPostFrom('/user/setUserImg', params)
}
// 修改头像
export const updateheadimage = (params) => {
  return http.fetchPost('/member/updateheadimage', params)
}
// 捐赠列表
export const thanksList = (params) => {
  return http.fetchGet('/member/thanks', params)
}
// 首页接口
export const productHome = (params) => {
  return http.fetchGet('/goods/home', params)
}
// 首页接口
export const navList = (params) => {
  return http.fetchGet('/goods/navList', params)
}
// 推荐板块
export const recommend = (params) => {
  return http.fetchGet('/goods/recommend', params)
}
// 捐赠板块
export const thank = (params) => {
  return http.fetchGet('/goods/thank', params)
}
// 极验验证码
export const geetest = (params) => {
  return http.fetchGet('/user/geetestInit?t=' + (new Date()).getTime(), params)
}
// 刷新token
export const reToken = (params) => {
  return http.fetchPost('/user/reToken', params)
}

