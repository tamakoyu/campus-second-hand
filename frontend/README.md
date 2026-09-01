# AI 智能校园二手交易平台 · 前端工程（V0.1 骨架）

> 步骤 2 交付物：可运行的前端工程骨架；步骤 3 已交付公共组件库（15 个组件 + 示例页）。
> 设计规范与联调约定见工作区 docs/ 与《接口约定规范-API-v1.1.md》。

## 公共组件库（步骤 3）

- 通用组件 src/components/common：BaseCard / BaseEmpty / BaseSkeleton / BasePagination / BaseTag / BasePrice / BaseImage / BaseModal
- 业务组件 src/components/business：SearchBar / GoodsCard / PageHeader / AiBadge / AiChat / AiPanel / AiRecommendCard
- 示例页：`npm run dev` 后访问 **/components**（ComponentDemo，本地 mock 演示数据）
- 组件清单与维护规则：工作区 docs/前端公共组件清单.md

## 技术栈

Vue 3 + Vite + Element Plus（按需引入）+ Pinia + Vue Router + Axios + SCSS。

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173（/api 代理到 http://localhost:8080）
npm run build      # 产物输出 dist/
npm run preview    # 本地预览构建产物
```

## 目录结构（摘要）

```
src/
├── api/        # 接口封装唯一出口（全部经 utils/request.js）
├── assets/     # 静态资源（images/icons/fonts）
├── components/ # common（Base 前缀通用组件）/ business（业务组件）——步骤 3 填充
├── layouts/    # DefaultLayout（带导航）/ BlankLayout（空布局）
├── router/     # 路由表 + 懒加载 + 全局守卫
├── store/      # Pinia：user / goods / ai
├── styles/     # 全局 token（variables/reset/element-override/index）
├── utils/      # request（axios 实例）/ auth / format / dict
└── views/      # 页面（一页一目录，当前为占位页）
```

## 环境变量

| 变量 | dev | prod | 说明 |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | `/api`（vite 代理到 8080） | `/api`（同源） | axios baseURL |

## 联调约定要点（详见 docs/前端联调约定.md）

- 统一前缀 `/api`；响应 `{code, message, data}`，`code=0` 成功，拦截器自动解包出 data。
- 分页 `{list, total, page, pageSize}`（page 从 1 起，pageSize 默认 10 最大 100）。
- 金额单位「分」，展示用 `utils/format.js` 的 `formatPrice` 转元。
- 认证 `Authorization: Bearer <token>`（localStorage 键 `token`），401 自动清 token 跳登录。
- 普通接口超时 10s，AI 接口（`utils/request.js` 的 `aiRequest`）20s。
- 后端当前 `mock: true`（AI 返回稳定预设响应），前端无需感知开关。
