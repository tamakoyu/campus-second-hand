# 后端模块（backend）— 负责人：田博

> 本目录为 **田博** 负责的校园二手交易平台后端模块。
> 技术栈：Spring Boot 3.2.5 + MyBatis-Plus 3.5.7 + PostgreSQL 15/16（接口契约见根目录《接口约定规范-API-v1.1.md》）。

## 本目录内容 = 田博的贡献

| 模块 | 说明 |
|------|------|
| **数据库表结构设计**（`sql/schema.sql`） | 14 张表：用户/分类/商品/图片/收藏/浏览/订单/互评/私信/减碳记录/环保积分/AI 估价日志/AI 草稿；PostgreSQL 版（IDENTITY 主键、JSONB、pg_trgm 检索、触发器维护 updated_at） |
| **商品核心业务接口**（`src/.../product`） | 发布/编辑/上下架/删除/分页检索/详情/我的商品/浏览足迹/猜你喜欢（对齐规范 v1.1 第 7 节：cover/views/category/condition/seller/originalPrice） |
| **收藏接口**（`src/.../favorite`） | 收藏/取消（幂等切换）、我的收藏 |
| **AI 估价规则引擎**（`src/.../ai/rules`） | 纯 Java 零依赖：基准价/原价 × 成色系数 × 年限衰减 × 热度系数，区间 ±10%，系数可解释可审计 |
| **AI 识别/描述/估价接口**（`/api/ai/identify|describe|estimate`） | 对齐规范 6.1~6.3：图片 base64 识别、描述生成、双层估价（规则引擎兜底 + 大模型降级，engine 字段） |
| **AI 自动填表发布链路**（`/api/ai/draft|publish`） | 识别 → 描述 → 估价 → 草稿 → 一键发布（幂等防重、AI 辅助审核开关） |
| **AiService.chat()**（`src/.../ai/AiService`） | 规范 6.4 问答底层方法（Mock 返回 null / HTTP 多轮 history），供林天楚接入 `/api/ai/chat` |
| **商品审核流转**（`/api/admin/products/{id}/review`） | 组长分工：AI 预检 `/api/ai/review`（陈思瀚）→ 管理员决定 → 状态流转（审核中→在售/驳回） |
| **统一契约**（`src/.../common`） | `{code,message,data}`（code=0 成功）、错误码分段（400xx~500xx）、HTTP 状态、金额分、分页 `{list,total,page,pageSize}`、时间 `yyyy-MM-dd HH:mm:ss` |
| **枚举字典**（`/api/dicts`） | 分类/成色/商品状态/订单状态（免登录） |
| **单元测试**（`src/test`） | 36 个用例：规则引擎/商品状态机/估价/发布链路/审核流转 |

## 非田博模块（由对应成员实现，本目录不含）

- 登录/权限（`/api/auth/*`）、AI 服务层（`/api/ai/review`、`/api/ai/recommend`）→ **陈思瀚**
- AI 问答（`/api/ai/chat`）、私信（`/api/message/*`）、减碳、后台统计 → **林天楚**

## 启动方式（需联网环境）

```bash
# 1. 建库（二选一）
psql -U postgres -f sql/schema.sql
# 或无 psql：java -cp <postgresql-jdbc.jar> InitDb <密码> sql/schema.sql

# 2. 设置数据库密码环境变量（勿提交真实密码）
set DB_PASSWORD=你的密码     # Windows
export DB_PASSWORD=你的密码  # Linux/macOS

# 3. 构建运行
mvn clean package
java -jar target/second-hand-backend-0.1.0-SNAPSHOT.jar
# 接口根路径 http://localhost:8080/api/...
```

## 本机离线（无网）验证

本仓库附带离线验证三件套（仅开发用，勿部署）：
- `pom.verify.xml`：离线验证 POM（排除需联网下载的驱动与 boot3 starter）
- `settings.offline.xml`：file:// 镜像 settings
- `maven-repo/`：依赖副本（**已 gitignore，不提交**，需各自联网 `mvn dependency:go-offline` 或从个人环境复制）

```bash
mvn -s settings.offline.xml -f pom.verify.xml clean test-compile
java -cp <test-classpath> com.hdu.secondhand.TestRunner   # 36 个用例
```
