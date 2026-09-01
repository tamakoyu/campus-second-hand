// 认证接口（《接口约定规范 v1.1》§5 /auth/*）
import { request } from '@/utils/request'

/**
 * 登录（学号/手机号 + 密码）
 * @param {{ account: string, password: string }} data
 * @returns {Promise<{accessToken: string, tokenType: string, expiresIn: number, user: object}>}
 */
export function login(data) {
  return request.post('/auth/login', data)
}

/**
 * 注册
 * @param {{ studentNo, name, major, phone, password, confirmPassword }} data
 * @returns {Promise<{userId: number, studentNo: string, name: string, phone: string, realNameVerified: boolean}>}
 */
export function register(data) {
  return request.post('/auth/register', data)
}

/** 学号预检（注册页） @param {string} studentNo @returns {Promise<{valid: boolean, registered: boolean}>} */
export function checkStudent(studentNo) {
  return request.get('/auth/check-student', { params: { studentNo } })
}

/** 获取当前登录用户信息（需登录） @returns {Promise<object>} */
export function getMe() {
  return request.get('/auth/me')
}

/** 学号实名认证（需登录） @param {{studentNo, name, major}} data @returns {Promise<{realNameVerified: boolean, verifiedAt: string}>} */
export function realName(data) {
  return request.post('/auth/real-name', data)
}

/** 修改密码（需登录） @param {{oldPassword, newPassword}} data */
export function changePassword(data) {
  return request.put('/auth/password', data)
}

/** 退出登录（需登录；前端同时清除本地 token） */
export function logout() {
  return request.post('/auth/logout')
}

const authApi = { login, register, checkStudent, getMe, realName, changePassword, logout }
export default authApi
