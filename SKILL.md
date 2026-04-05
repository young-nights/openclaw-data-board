# UI Chart Interactive Behavior Skill
这个技能让 Agent 能够**精准理解并实现**类似 OpenRouter Activity 页面的柱状图交互效果。
## 核心交互要求（必须严格遵守）
### 1. Hover（鼠标悬停）交互
- 当鼠标移动到任意一个柱体（例如 MiMo-V2-Pro 的绿色柱子）时：
  - **选中柱体颜色加深**（饱和度更高、更深色）。
  - **其他所有柱体颜色明显淡出**（降低不透明度或亮度）。
  - 同时在鼠标附近（优先柱体右侧或正上方，避免遮挡）弹出**悬浮信息窗口（Tooltip）**。
- Tooltip 样式要求：
  - 白色背景、轻微阴影、圆角边框。
  - 显示：模型名称 + 对应数值（带单位，如 323M、16M）。
  - 包含颜色小方块作为图例。
  - 如果有 Total，显示 Total 行。
  - Tooltip 位置必须**紧随对应柱体**（跟随具体柱子，而不是单纯跟随鼠标指针）。
### 2. Click（鼠标点击）交互
- 点击某个模型对应的柱体（或表格行）后：
  - **只保留该模型的柱体**（其他模型柱体全部隐藏或完全淡出）。
  - 例如：
    - 点击 MiMo-V2-Pro → 只剩下绿色柱体。
    - 点击 MiMo-V2-Omni → 只剩下蓝色柱体。
  - 再次点击其他模型或空白处可恢复全部柱体（可选，但推荐支持）。
- 点击后 Tooltip 消失或更新为当前选中状态。
### 3. 表格联动
- 下方的模型表格与柱状图完全联动：
  - Hover 表格某一行 → 对应柱体执行 hover 高亮效果。
  - 点击表格某一行 → 执行 click 过滤效果。
- 表格保持清晰边框、分明行列（使用 Tailwind 或 shadcn/ui 风格）。
### 4. 技术实现约束（推荐方案）
- **首选库**：Recharts（React）
  - 使用 `} cursor={false} />`
  - 在 CustomTooltip 中实现白色卡片样式 + 颜色图例 + Total。
  - Hover 时通过 `onMouseEnter` / `onMouseLeave` 控制各 Bar 的 `fillOpacity` 或动态修改 `fill` 颜色实现加深/淡出。
- **备选**：Chart.js + 自定义 external Tooltip
  - 使用 `tooltip.external` 函数手动创建 HTML div，并根据柱体坐标（getBoundingClientRect 或 caretX/Y）精确定位。
- Tooltip 必须跟随具体柱体位置（可通过计算柱子 bounding rect + 偏移量实现）。
- 支持 ResponsiveContainer，保证在不同屏幕尺寸下交互正常。
## 使用时机
- 当任务涉及实现、分析或复刻 OpenRouter Activity 页面的 Tokens By Model / Requests By Model 图表时。
- 当用户要求“鼠标悬停时柱体高亮，其余淡出”、“点击只显示单个模型柱体”、“Tooltip 紧随柱体”等交互时。
- 在生成前端代码（React/Next.js）时，必须优先应用本技能的交互规则。
## 输出要求
1. 先确认理解了上述交互规则。
2. 生成代码时必须完整实现 hover 高亮 + click 过滤 + 紧随柱体的自定义 Tooltip。
3. 如果使用 Recharts，提供完整的 CustomTooltip 组件代码。
4. 确保表格与图表联动。
## 质量标准
- Hover 效果必须明显（加深 vs 明显淡出）。
- Tooltip 位置精准、不遮挡柱体。
- Click 过滤后图表清晰，只显示选中模型。
- 代码干净、可维护，使用 Tailwind CSS 实现卡片样式。