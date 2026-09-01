// token 存取与登录态判断（《接口约定规范 v1.1》§4.2）
const TOKEN_KEY = 'token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    clearToken()
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

// 尽力解析 JWT payload（仅取 userId 等非敏感信息；解析失败返回 null）
export function getTokenPayload() {
  const token = getToken()
  if (!token) return null
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = decodeURIComponent(escape(atob(part.replace(/-/g, '+').replace(/_/g, '/'))))
    return JSON.parse(json)
  } catch {
    return null
  }
}
