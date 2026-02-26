# Realtime Weather Page

基于 `React + TypeScript + Vite` 的实时天气页面，使用 Open-Meteo 实时数据，为北京 / 上海 / 深圳提供天气展示。

## 功能亮点

- 城市切换：北京、上海、深圳
- 实时天气数据：温度、湿度、风速
- 四种天气场景：`Sunny` / `Rainy` / `Windy` / `Snowy`
- 自动刷新（60 秒）
- 完整加载态与错误态
- 玻璃拟态与轻动画视觉效果
- 响应式布局（桌面 + 移动端）

## 快速开始

```bash
npm install
npm run dev
```

## 常用命令

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## 技术栈

- React 19
- TypeScript 5
- Vite 7
- ESLint 9

## 目录结构

```text
src/
├─ constants/cities.ts    # 城市坐标配置
├─ lib/weather.ts         # Open-Meteo 请求与天气场景映射
├─ types/weather.ts       # 天气相关类型定义
├─ App.tsx                # 页面主逻辑
├─ App.css                # 场景样式与动画
├─ index.css              # 全局样式
└─ main.tsx               # 应用入口
```

## 说明

- 数据来源：Open-Meteo Forecast API
- `vite.config.ts` 中 `base` 配置为 `/weather/`
