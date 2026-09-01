# xjk666
校园二手交易平台

## 模块分工

| 模块 | 负责人 |
| --- | --- |
| 前端工程与公共组件库（Vue3 + Vite + Element Plus）、首页 / 列表检索 / 详情页 / AI 智能问答 / AI 推荐位 | 范胜洲 |
| 前端登录 / 个人中心 / AI 发布 / 私信 / 管理后台 | 徐家凯 |
| 后端商品接口 | 田博 |
| 私信 / 减碳接口 | 林天楚 |
| 组长 / AI 服务层 | 陈思瀚 |

> 前端设计规范与联调约定见 `docs/`；接口契约见《接口约定规范-API-v1.1.md》；前端启动方式见 `frontend/README.md`。

## 后端模块（田博）

后端代码位于 **`backend/`**（Spring Boot 3.2.5 + MyBatis-Plus 3.5.7 + PostgreSQL）：

- 模块内容与田博贡献清单：见 `backend/README.md`
- 数据库设计：`backend/sql/schema.sql`（14 表，PostgreSQL）
- 接口说明：`backend/docs/接口说明文档.md`（对齐《接口约定规范-API-v1.1.md》）
- 启动方式：见 `backend/README.md`（需联网环境）
