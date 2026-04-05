# OpenClaw Data Board - 重构总结

## 重构目标
将传统 HTML + SSE 轮询面板重构为 **LVGL 风格的丝滑现代 UI**（Svelte 5 + Vite）

## 技术栈
- **前端框架**: Svelte 5 (Runes + $state / $derived)
- **构建工具**: Vite 6+
- **后端服务**: Node.js 原生 http + serve-static
- **编程语言**: TypeScript (严格模式)
- **样式方案**: 原生 CSS + CSS Variables + Glassmorphism
- **实时通信**: SSE (Server-Sent Events)
- **动画实现**: CSS transition + will-change + rAF

## 项目结构

```
openclaw-data-board/
├── frontend/                 # 新增：Vite + Svelte 5 前端项目
│   ├── src/
│   │   ├── components/       # Svelte 组件
│   │   │   ├── Dashboard.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   ├── GlobalVisibility.svelte
│   │   │   ├── ConnectionHealth.svelte
│   │   │   ├── MemoryStatus.svelte
│   │   │   ├── SecurityStatus.svelte
│   │   │   ├── UpdateStatus.svelte
│   │   │   ├── ContextPressure.svelte
│   │   │   ├── TaskCertainty.svelte
│   │   │   ├── InformationCertainty.svelte
│   │   │   ├── BrainSection.svelte
│   │   │   └── common/       # 通用组件
│   │   │       ├── Card.svelte
│   │   │       ├── Badge.svelte
│   │   │       ├── StatusStrip.svelte
│   │   │       └── Gauge.svelte
│   │   ├── stores/           # Svelte stores
│   │   │   ├── api.ts        # API 客户端
│   │   │   ├── sse.ts        # SSE 连接管理
│   │   │   └── state.ts      # 全局状态
│   │   ├── styles/           # CSS 样式
│   │   │   ├── variables.css # CSS 变量
│   │   │   ├── global.css    # 全局样式
│   │   │   └── components.css # 组件样式
│   │   ├── types/            # TypeScript 类型
│   │   │   └── index.ts
│   │   ├── App.svelte        # 根组件
│   │   └── main.ts           # 入口文件
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── package.json
├── src/
│   └── ui/
│       └── server.ts         # 重构后：仅 API + 静态文件服务
├── dist/                     # 前端构建输出
├── .npmrc
├── .gitattributes
└── package.json              # 更新脚本和依赖
```

## 性能目标
- 生产环境下前端 bundle (gzip 后) ≤ 200KB
- 首屏加载时间 < 800ms

## 开发命令
```bash
# 同时启动 API 和 Frontend
pnpm dev

# 仅启动 API
pnpm dev:api

# 仅启动 Frontend
pnpm dev:frontend

# 构建前端
pnpm build:frontend

# 完整构建
pnpm build
```

## 文件变更清单

### 新增文件
1. `frontend/package.json` - 前端项目配置
2. `frontend/vite.config.ts` - Vite 配置
3. `frontend/tsconfig.json` - TypeScript 配置
4. `frontend/index.html` - HTML 入口
5. `frontend/src/main.ts` - 前端入口
6. `frontend/src/App.svelte` - 根组件
7. `frontend/src/stores/api.ts` - API 客户端
8. `frontend/src/stores/sse.ts` - SSE 管理
9. `frontend/src/stores/state.ts` - 全局状态
10. `frontend/src/styles/variables.css` - CSS 变量
11. `frontend/src/styles/global.css` - 全局样式
12. `frontend/src/types/index.ts` - 类型定义
13. 所有 Svelte 组件文件
14. `.npmrc` - npm 配置
15. `.gitattributes` - Git 属性

### 修改文件
1. `src/ui/server.ts` - 移除 HTML 渲染，保留 API
2. `package.json` - 更新脚本和依赖

### 删除文件（重构后清理）
- 旧的 HTML 字符串模板渲染逻辑
- 所有 inline `<style>` 和 `<script>`
- `package-lock.json`
- `ecosystem.config.cjs`
- `docs/`, `test/`, `scripts/ui-smoke.js` 等非核心文件
