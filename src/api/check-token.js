'use strict'
import vueCookie from 'vue-cookie'
import net from './public'
import { setStore } from '/utils/storage'

const tokenName = 'token'
const tokenValid = 30
// let refreshUrl = 'http://47.95.249.44:80/user/reToken';
let refreshUrl = 'http://127.0.0.1:8090/user/reToken';
let intervalFlag = true;

const checkToken = {
  /**
   * 保存token 每 * 分钟换取一次token
   * @param  {Function} callback     请求成功 code === 0 && status === 200 回调函数
   * @param  {Function} errCallback  请求失败 (status != 200 || code = -1) 回调函数
   */
  refresh: function refresh(callback, errorCallback) {
    let time = window.setInterval(function () {
      let token = checkToken.getToken();
      if (token && token !== "undefined") {
        if (!intervalFlag) {
          clearInterval(time);
          return;
        }
        checkToken.getAxiosToken(callback, errorCallback);
      }
    }, tokenValid * 60 * 1000);
    // }, 5000);
  },

  /**
   * 暴露的 刷新token
   * refresh 先调用是因为有可能 tokenValid 期间业务可能会存入token
   * @param  {Function} callback     请求成功 code === 0 && status === 200 回调函数
   * @param  {Function} errCallback  请求失败 (status != 200 || code = -1) 回调函数
   */
  refreshToken: function refreshToken(callback, errorCallback) {
    checkToken.refresh();
    let token = checkToken.getToken();
    if (!token || token === "undefined") return;
    checkToken.getAxiosToken(callback, errorCallback);
  },

  /**
   * 登陆保存token 并启动刷新定时器
   */
  saveToken: function saveToken(token) {
    vueCookie.set(tokenName, token, { expires: tokenValid + 1 + "m" });
    setStore('token', token)
    // checkToken.refresh()
  },

  /**
   * 从后端接口获取 token
   * @param  {Function} callback     请求成功 code === 0 && status === 200 回调函数
   * @param  {Function} errCallback  请求失败 (status != 200 || code = -1) 回调函数
   */
  getAxiosToken: function getAxiosToken(callback, errCallback) {
    net.fetchPost(refreshUrl).then(function (response) {
      if (response.status === 'success') {
        checkToken.saveToken(response && response.data);
      }
      callback && callback(response);
    }).catch(function (err) {
      checkToken.removeToken();
      let error = typeof err.data === "string" ? JSON.parse(err.data) : err.data;
      errCallback && errCallback(error);
    });
  },


  /**
   * 获取本地的 token
   */
  getToken: function getToken() {
    return vueCookie.get(tokenName);
  },

  /**
   * 移除本地的 token，并清除定时器
   * logout 调用的方法
   */
  removeToken: function removeToken() {
    intervalFlag = false;
    vueCookie.delete(tokenName);
  },

  /**
   * 登录后退出再登录，将无法refresh
   * login.js 有用到
   */
  changeInterval: function changeInterval() {
    intervalFlag = true;
  }
};
export default checkToken
