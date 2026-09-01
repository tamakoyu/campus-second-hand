# 校园二手交易平台 · 接口约定规范（API 规范 v1.1）

> 适用范围：AI 智能校园二手物品交易平台全体成员（前端 / 后端 / AI 模块）
> 制定：陈思瀚（组长）　状态：**已确认，全组按此开发**
> 说明：本规范是前后端联调的唯一依据，接口如有调整需更新本文档并同步全员。
> v1.1 更新（响应范胜洲联调需求）：新增「7. 商品接口定义」「8. AI 推荐位接口」；4.3 白名单、9. 超时约定、11. 附录速查总表同步更新。

---

## 1. 总则

| 项目 | 约定 |
| --- | --- |
| 通信协议 | HTTP / HTTPS，JSON 格式 |
| 统一前缀 | 所有接口以 `/api` 开头（如 `/api/auth/login`） |
| 请求头 | `Content-Type: application/json; charset=UTF-8` |
| 字符编码 | UTF-8 |
| 时间格式 | 字符串 `yyyy-MM-dd HH:mm:ss`（服务器本地时区） |
| 金额单位 | 整数「分」（避免浮点误差），前端展示时除以 100 |
| 图片传输 | AI 识别等接口传 base64 字符串（含 `data:image/...;base64,` 前缀），单张 ≤ 5MB |

---

## 2. 统一响应结构 `{code, message, data}`

所有接口（成功与失败）统一返回以下结构：

```json
{
  "code": 0,
  "message": "success",
  "data": { }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `code` | int | 业务状态码，`0` 表示成功，非 0 表示失败（见第 3 节错误码表） |
| `message` | string | 提示信息，失败时为可直接展示给用户的描述；成功时固定 `"success"` |
| `data` | object/null | 业务数据；无数据时返回 `null`（不要省略该字段） |

### 成功示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 1,
    "realNameVerified": false
  }
}
```

### 失败示例

```json
{
  "code": 40102,
  "message": "账号或密码错误",
  "data": null
}
```

### 分页结构（列表类接口统一使用）

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [],
    "total": 128,
    "page": 1,
    "pageSize": 10
  }
}
```

分页参数统一为 `?page=1&pageSize=10`（page 从 1 开始，pageSize 默认 10，最大 100）。

---

## 3. HTTP 状态码与业务错误码

### 3.1 HTTP 状态码约定

前端拦截器按 HTTP 状态码做全局处理，业务细节看 body 中的 `code` 与 `message`。

| HTTP 状态码 | 业务 code 段 | 场景 | 前端全局处理 |
| --- | --- | --- | --- |
| 200 | 0 | 成功 | 正常处理 |
| 400 | 400xx | 参数/业务校验失败 | 弹出 `message` |
| 401 | 401xx | 未认证 / 凭证错误 | 清除 Token，跳转登录页 |
| 403 | 403xx | 无权限 / 资格不足 | 弹出 `message` |
| 404 | 404xx | 资源不存在 | 弹出 `message` |
| 429 | 429xx | 请求过于频繁 | 弹出 `message`，禁用按钮防抖 |
| 500 | 500xx | 服务端异常 | 弹出通用错误提示 |

### 3.2 错误码分段

| 段位 | 范围 | 含义 |
| --- | --- | --- |
| 0 | 0 | 成功 |
| 400xx | 40000 - 40099 | 通用参数与业务校验错误 |
| 401xx | 40100 - 40199 | 认证错误 |
| 403xx | 40300 - 40399 | 授权 / 资格错误 |
| 404xx | 40400 - 40499 | 资源不存在 |
| 429xx | 42900 - 42999 | 限流 |
| 500xx | 50000 - 50099 | 服务端错误 |

### 3.3 错误码明细表

| code | HTTP | message（示例） | 说明 |
| --- | --- | --- | --- |
| 0 | 200 | success | 成功 |
| 40000 | 400 | 参数错误 | 通用参数错误 |
| 40001 | 400 | 必填参数缺失 | 缺少必填字段 |
| 40002 | 400 | 参数格式错误 | 如手机号/学号格式不对 |
| 40003 | 400 | 该学号已注册 | 数据已存在 |
| 40004 | 400 | 数据不存在 | 通用 |
| 40005 | 400 | 当前状态不允许该操作 | 状态冲突（如商品已下架仍下单） |
| 40010 | 400 | 学号、姓名或专业信息不一致，实名认证失败 | 实名认证校验不通过 |
| 40011 | 400 | 非本校师生，无法注册 | 学号校验失败（排除校外人员） |
| 40012 | 400 | 两次输入的密码不一致 | 注册/改密 |
| 40100 | 401 | 未登录或登录已失效 | Token 缺失 |
| 40101 | 401 | Token 无效或已过期 | Token 校验失败 |
| 40102 | 401 | 账号或密码错误 | 登录失败 |
| 40103 | 401 | 账号已被禁用 | 管理员封禁 |
| 40300 | 403 | 无权限执行该操作 | 越权（如普通用户调管理接口） |
| 40301 | 403 | 请先完成学号实名认证 | 未实名认证调用需实名接口（如发布商品） |
| 40302 | 403 | 信用分不足，暂时无法发布/交易 | 信用分限制 |
| 40400 | 404 | 资源不存在 | 通用 |
| 40401 | 404 | 商品不存在或已下架 | 商品查询/购买 |
| 40402 | 404 | 订单不存在 | 订单查询/操作 |
| 42900 | 429 | 请求过于频繁，请稍后再试 | 接口限流 |
| 42901 | 429 | AI 服务繁忙，请稍后再试 | AI 接口限流（前端可提示重试） |
| 50000 | 500 | 服务器开小差了，请稍后再试 | 未捕获异常 |
| 50001 | 500 | 数据库操作失败 | 数据库异常 |
| 50002 | 500 | AI 服务暂不可用，已使用规则引擎结果 | AI 调用失败降级（业务仍返回 200 + code 0 时见 5.2） |
| 50003 | 500 | 图片解析失败 | base64 无效或图片损坏 |
| 50400 | 504 | 服务处理超时 | 网关/服务超时 |

> 约定：新增错误码需在此表登记，code 全局唯一，不允许复用。

---

## 4. Token 认证约定

### 4.1 认证方式

- 采用 **JWT（Access Token）**，登录成功后由后端签发。
- **请求头**：`Authorization: Bearer <accessToken>`
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.xxx
  ```
- **有效期**：accessToken 2 小时（7200 秒）；开发调试期可放宽至 24 小时。
- **载荷**：`sub`（userId）、`studentNo`、`name`、`role`（`USER` / `ADMIN`）、`iat`、`exp`。
- **密钥**：存于后端环境变量（`JWT_SECRET`），禁止硬编码、禁止下发前端。

### 4.2 前后端约定

| 项目 | 约定 |
| --- | --- |
| 前端存储 | `localStorage` 的 `token` 键（简单项目不强制 refresh 机制） |
| 请求注入 | axios 请求拦截器统一注入 `Authorization` 头 |
| 401 处理 | axios 响应拦截器：HTTP 401 时清除 token 并跳转登录页 |
| 服务端校验 | Spring Boot 拦截器 / 过滤器解析 JWT，注入当前用户上下文（ThreadLocal） |
| 登出 | 前端删除本地 token；服务端 token 黑名单为可选增强，V1.0 前可不做 |

### 4.3 免登录白名单（不需要 Token）

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/auth/check-student | 学号校验（注册预检） |
| GET | /api/products/** | 商品浏览 / 检索 / 详情（只读） |
| GET | /api/ai/recommend | AI 推荐位（未登录降级热门） |
| GET | /api/dicts | 枚举字典 |

> 收藏、发布、下单、私信、AI 接口、管理后台等均需登录（管理接口还需 `role = ADMIN`）。

---

## 5. /auth/* 接口定义

> 统一前缀 `/api`，以下路径均为完整路径。

### 5.1 POST /api/auth/register —— 注册

**请求体**

```json
{
  "studentNo": "20230001",
  "name": "张三",
  "major": "计算机科学与技术",
  "phone": "13800000000",
  "password": "Abc123456",
  "confirmPassword": "Abc123456"
}
```

**字段说明**

| 字段 | 类型 | 必填 | 校验规则 |
| --- | --- | --- | --- |
| studentNo | string | 是 | 本校学号，格式 `\d{6,12}`，且需与学校学号库一致（排除校外人员） |
| name | string | 是 | 与学号对应的真实姓名 |
| major | string | 是 | 专业名称 |
| phone | string | 是 | 11 位手机号 |
| password | string | 是 | 6-20 位，包含字母和数字 |
| confirmPassword | string | 是 | 与 password 一致 |

**成功响应 data**

```json
{
  "userId": 1,
  "studentNo": "20230001",
  "name": "张三",
  "phone": "13800000000",
  "realNameVerified": false
}
```

**失败**：学号已注册 → `40003`；非本校 → `40011`；密码不一致 → `40012`。

### 5.2 POST /api/auth/login —— 登录

**请求体**

```json
{
  "account": "20230001",
  "password": "Abc123456"
}
```

> `account` 支持学号或手机号登录。

**成功响应 data**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.xxx",
  "tokenType": "Bearer",
  "expiresIn": 7200,
  "user": {
    "id": 1,
    "studentNo": "20230001",
    "name": "张三",
    "avatar": null,
    "creditScore": 100,
    "realNameVerified": false,
    "role": "USER"
  }
}
```

**失败**：账号或密码错误 → `40102`；账号禁用 → `40103`。

### 5.3 POST /api/auth/real-name —— 学号实名认证

**请求体**

```json
{
  "studentNo": "20230001",
  "name": "张三",
  "major": "计算机科学与技术"
}
```

**成功响应 data**

```json
{
  "realNameVerified": true,
  "verifiedAt": "2026-09-01 10:00:00"
}
```

**失败**：信息不一致 → `40010`（后端校验学号、姓名、专业三者一致性）。

### 5.4 GET /api/auth/me —— 获取当前登录用户信息

**响应 data**（同 5.2 中的 `user` 对象，追加 `phone`、`email`、`carbonAmount` 等扩展字段）

```json
{
  "id": 1,
  "studentNo": "20230001",
  "name": "张三",
  "phone": "13800000000",
  "avatar": null,
  "creditScore": 100,
  "realNameVerified": true,
  "role": "USER",
  "carbonAmount": 12.5
}
```

### 5.5 PUT /api/auth/password —— 修改密码（需登录）

**请求体**

```json
{
  "oldPassword": "Abc123456",
  "newPassword": "Def654321"
}
```

**成功响应**：`data: null`。旧密码错误 → `40000`。

### 5.6 POST /api/auth/logout —— 退出登录（需登录）

**成功响应**：`data: null`（前端同时清除本地 token）。

### 5.7 GET /api/auth/check-student —— 学号预检（注册页调用）

**参数**：`?studentNo=20230001`

**成功响应 data**

```json
{
  "valid": true,
  "registered": false
}
```

---

## 6. AI 接口定义（真实路径）

> AI 调用统一走后端 `AiService` 封装：**双供应商互备 + 5~10 秒超时 + 失败自动降级规则引擎**。
> 前端通过响应中的 `engine` 字段判断结果来源：`llm`（大模型）/ `rule`（规则引擎兜底）。

### 6.1 POST /api/ai/identify —— AI 商品识别（图片 → 分类 + 成色）

用于「AI 智能发布」第一步：上传图片，AI 自动识别商品分类与成色。

**请求体**

```json
{
  "imageBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**成功响应 data**

```json
{
  "category": "digital",
  "categoryName": "数码产品",
  "condition": "90",
  "conditionName": "九成新",
  "confidence": 0.92,
  "engine": "llm"
}
```

**失败**：图片解析失败 → `50003`；AI 不可用 → 降级返回 `engine: "rule"` + 默认分类（见 6.5）。

### 6.2 POST /api/ai/describe —— AI 描述生成

用于「AI 智能发布」第二步：根据图片与卖家补充信息自动生成描述草稿。

**请求体**

```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "category": "digital",
  "condition": "90",
  "keywords": ["机械键盘", "87键", "青轴"]
}
```

**成功响应 data**

```json
{
  "description": "九成新机械键盘，87 键青轴，使用约半年，功能正常，无维修史，附原装数据线。",
  "engine": "llm"
}
```

### 6.3 POST /api/ai/estimate —— AI 智能估价（双层架构）

用于「AI 智能发布 / 详情页估价」，返回建议售价与价格区间及理由。

**请求体**

```json
{
  "originalPrice": 399,
  "category": "digital",
  "condition": "90",
  "imageBase64": "data:image/jpeg;base64,..."
}
```

**成功响应 data**

```json
{
  "suggestPrice": 199,
  "priceRange": {
    "min": 160,
    "max": 240
  },
  "reason": "原价 399 元，九成新数码产品折旧系数约 0.5，结合平台近期同类成交价区间 160~240 元，建议售价 199 元。",
  "engine": "llm"
}
```

**降级说明**：第一层规则引擎按「品类折旧系数 × 成色系数 × 原价」计算基础估价，任何环境可用；大模型层超时/异常/JSON 解析失败时自动降级第一层，响应中 `engine: "rule"`，前端可提示「AI 服务暂不可用，已使用规则估价」。

### 6.4 POST /api/ai/chat —— AI 智能问答（商品详情页，需登录）

**请求体**

```json
{
  "productId": 12,
  "question": "还能再便宜一点吗？",
  "history": [
    { "role": "user", "content": "这款键盘用了多久？" },
    { "role": "assistant", "content": "使用约半年，功能正常。" }
  ]
}
```

**成功响应 data**

```json
{
  "answer": "该商品支持小刀，建议您在站内私信与卖家进一步协商哦～",
  "fallback": false,
  "suggestManual": false
}
```

> `fallback: true` 表示大模型不可用、返回了规则/默认文案；`suggestManual: true` 表示引导转人工私信。

### 6.5 POST /api/ai/review —— AI 辅助审核（管理员，需 ADMIN 权限）

用于管理后台商品审核：AI 预检违禁词、敏感图、异常定价。

**请求体**

```json
{
  "title": "九成新机械键盘出售",
  "description": "青轴 87 键，使用半年，功能正常。",
  "imageBase64": "data:image/jpeg;base64,...",
  "price": 199
}
```

**成功响应 data**

```json
{
  "pass": true,
  "riskLevel": "low",
  "reasons": [],
  "engine": "llm"
}
```

> `pass` 仅为 AI 预检结论，最终由管理员人工复核后决定通过/驳回；`riskLevel`：low / medium / high。

### 6.6 AI 接口速查

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | /api/ai/identify | 登录 | 图片识别：分类 + 成色 |
| POST | /api/ai/describe | 登录 | 描述草稿生成 |
| POST | /api/ai/estimate | 登录 | 双层智能估价（规则引擎 + 大模型） |
| POST | /api/ai/chat | 登录 | 详情页智能问答 |
| POST | /api/ai/review | 管理员 | 商品 AI 预检（辅助审核） |

---

## 7. 商品接口定义（列表 / 检索 / 详情）

> 实现方：田博（商品核心业务接口）；接口契约由陈思瀚确认。以下为范胜洲前端联调的最终契约。

### 7.1 GET /api/products —— 商品列表 / 检索（免登录，只读）

**查询参数**

| 参数 | 类型 | 必填 | 取值 / 说明 |
| --- | --- | --- | --- |
| keyword | string | 否 | 关键词，匹配商品标题（后续可扩展匹配描述） |
| category | string | 否 | book / digital / living / sports / clothing / other |
| condition | string | 否 | 100 / 90 / 80 / 70 |
| minPrice | int | 否 | 最低价（分） |
| maxPrice | int | 否 | 最高价（分） |
| sort | string | 否 | latest（默认，最新）/ price_asc / price_desc / hot（热度=浏览量） |
| page | int | 否 | 页码，从 1 开始，默认 1 |
| pageSize | int | 否 | 默认 10，最大 100 |

> 仅返回在售商品（status=1）。

**成功响应 data**

```json
{
  "list": [
    {
      "id": 12,
      "title": "九成新机械键盘",
      "price": 19900,
      "originalPrice": 39900,
      "cover": "https://.../cover.jpg",
      "category": "digital",
      "categoryName": "数码产品",
      "condition": "90",
      "conditionName": "九成新",
      "views": 86,
      "createdAt": "2026-09-01 10:00:00",
      "seller": {
        "id": 1,
        "name": "张三",
        "avatar": null,
        "creditScore": 100,
        "realNameVerified": true
      }
    }
  ],
  "total": 128,
  "page": 1,
  "pageSize": 10
}
```

> 金额单位「分」；seller.name 对应 t_user.name（前端昵称展示用 name 字段）。
> 无匹配商品时返回空 list（total=0，code=0）。

### 7.2 GET /api/products/{id} —— 商品详情（免登录，只读）

**路径参数**：id（商品 ID）

**成功响应 data**

```json
{
  "id": 12,
  "title": "九成新机械键盘",
  "description": "青轴 87 键，使用半年，功能正常，附原装数据线。",
  "price": 19900,
  "originalPrice": 39900,
  "cover": "https://.../cover.jpg",
  "category": "digital",
  "categoryName": "数码产品",
  "condition": "90",
  "conditionName": "九成新",
  "views": 87,
  "createdAt": "2026-09-01 10:00:00",
  "seller": {
    "id": 1,
    "name": "张三",
    "avatar": null,
    "creditScore": 100,
    "realNameVerified": true
  }
}
```

> 浏览 +1：每次请求详情 views 自增 1（用于热度排序与统计）。
> 失败：商品不存在或已下架 → 40401。

## 8. AI 推荐位接口

> 实现方：陈思瀚（AI 服务层）。当前版本为「热门 / 同分类兜底」实现（不依赖大模型，稳定可联调）；登录用户个性化推荐（基于浏览/收藏/成交记录）待相关数据模块就绪后接入，接口契约不变。

### 8.1 GET /api/ai/recommend —— AI 推荐位（免登录，未登录降级热门）

**查询参数**

| 参数 | 类型 | 必填 | 取值 / 说明 |
| --- | --- | --- | --- |
| scene | string | 是 | home（首页"猜你喜欢"）/ detail（详情页"相关推荐"） |
| productId | long | detail 必填 | 当前商品 ID（scene=detail 时必填） |
| limit | int | 否 | 返回条数，默认 8，最大 20 |

**成功响应 data**

```json
{
  "items": [
    {
      "id": 15,
      "title": "高数教材上册",
      "price": 1500,
      "cover": "https://.../cover.jpg",
      "category": "book",
      "condition": "90",
      "reason": "热门推荐"
    }
  ]
}
```

**逻辑约定**

| 场景 | 逻辑 |
| --- | --- |
| scene=home，未登录 | 返回热门商品（浏览量降序），reason=「热门推荐」 |
| scene=home，已登录 | 优先基于浏览/收藏/成交记录个性化推荐（数据就绪后启用）；当前降级热门兜底 |
| scene=detail | 返回与当前商品同分类的在售商品（排除自身），按浏览量降序；不足时用热门补齐；reason=「与「{商品标题}」同类」或「热门推荐」 |

> reason 字段供推荐位 UI 直接展示。失败：productId 不存在 → 40401；scene 非法 → 40000。

## 9. 超时时间约定

| 位置 | 接口类型 | 超时时间 | 处理方式 |
| --- | --- | --- | --- |
| 前端 axios（全局） | 普通业务接口 | 10 秒 | 超时提示「请求超时，请重试」 |
| 前端 axios | AI 接口（identify/describe/estimate/chat/review） | 20 秒 | 超时提示「AI 服务响应较慢，请稍后重试」 |
| 前端 axios | 推荐位 /api/ai/recommend（当前为热门兜底实现） | 10 秒 | 数据兜底，不阻塞页面 |
| 后端 HttpClient | 大模型调用（LLM） | 连接 3 秒 + 读取 5 秒（chat 可放宽至 10 秒） | 超时即降级规则引擎 / 默认文案 |
| 后端 | 规则引擎估价 | 即时（无网络依赖） | 兜底链路，任何环境可用 |
| 上传 | 单张图片 | 大小 ≤ 5MB | base64 传输体积膨胀约 1.33 倍，前端建议压缩至 1MB 内再传 |
| 认证 | accessToken | 2 小时（7200 秒） | 过期返回 40101，前端跳登录 |

> 关键约定：**AI 请求失败不自动重试**，直接降级返回，保证演示流程永不中断。

---

## 10. 其他统一约定

1. **枚举字典**：商品分类、成色、订单状态、信用分等级等枚举由前端常量表维护（与后端校验一致），详见附表。
2. **商品分类** `category`：`book`(教材图书) / `digital`(数码产品) / `living`(生活用品) / `sports`(运动户外) / `clothing`(服饰鞋包) / `other`(其他)。
3. **成色** `condition`：`100`(全新) / `90`(九成新) / `80`(八成新) / `70`(七成新及以下)。
4. **订单状态** `orderStatus`：`0`(待付款) / `1`(待发货) / `2`(待收货) / `3`(已完成) / `4`(已取消)。
5. **信用分等级**：`≥110` 优秀 / `90-109` 良好 / `<90` 一般（影响发布与交易权限）。
6. **接口命名**：RESTful，名词复数 + 动作；查询用 GET，新增 POST，修改 PUT，删除 DELETE。
7. **全局异常**：后端统一异常拦截器，任何未处理异常都转换为 `{code: 50000, message, data: null}`，禁止裸抛堆栈给前端。
8. **文档同步**：接口变更必须同步更新本文档，并在小组群里@全员。

---

## 11. 附录：本规范接口速查总表

| 方法 | 路径 | 鉴权 | 说明 |
| --- | --- | --- | --- |
| POST | /api/auth/register | 免登录 | 注册 |
| POST | /api/auth/login | 免登录 | 登录（学号/手机号 + 密码） |
| GET | /api/auth/check-student | 免登录 | 学号预检 |
| GET | /api/auth/me | 登录 | 当前用户信息 |
| POST | /api/auth/real-name | 登录 | 学号实名认证 |
| PUT | /api/auth/password | 登录 | 修改密码 |
| POST | /api/auth/logout | 登录 | 退出登录 |
| POST | /api/ai/identify | 登录 | AI 识别（分类 + 成色） |
| POST | /api/ai/describe | 登录 | AI 描述生成 |
| POST | /api/ai/estimate | 登录 | AI 智能估价（双层） |
| POST | /api/ai/chat | 登录 | AI 智能问答 |
| POST | /api/ai/review | 管理员 | AI 辅助审核 |
| GET | /api/products/** | 免登录 | 商品浏览/检索/详情（只读） |
| GET | /api/products | 免登录 | 商品列表 / 检索（分页+筛选+排序） |
| GET | /api/products/{id} | 免登录 | 商品详情（浏览 +1） |
| GET | /api/ai/recommend | 免登录 | AI 推荐位（home/detail，未登录降级热门） |
| GET | /api/dicts | 免登录 | 枚举字典 |

---

*本规范由陈思瀚制定并确认，作为前后端联调唯一依据。如有异议请在小组例会上提出并修订。*
