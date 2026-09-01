# mock 说明

当前阶段后端已开启 `mock: true`（AI 接口返回稳定预设响应，认证流程与真实一致，见《前端联调约定》§6），
前端不需要额外 mock，直接联调 `/api` 即可。

本目录预留给"后端未就绪时的前端本地 mock"场景：届时可在 `src/utils/request.js` 中按开关切换
baseURL 到本地 mock（如 `VITE_USE_MOCK=true` + `/mock` 静态目录），接口就绪后删除。
