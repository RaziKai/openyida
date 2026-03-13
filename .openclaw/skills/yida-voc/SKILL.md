---
name: yida-voc
description: 宜搭 VOC 工单规范化技能，根据用户描述自动生成标准格式的 Bug 报告、功能建议或性能问题工单文案，并可直接提交到 GitHub Issue。
metadata: {"openclaw":{"emoji":"📋","requires":{"bins":["node","gh"]}}}
---

# 宜搭 VOC 工单规范化技能

## 概述

本技能根据用户输入的问题描述，自动生成标准格式的宜搭工单文案（Bug 报告 / 功能建议 / 性能问题），解决工单信息不完整、格式混乱的问题，并可通过 `gh` CLI 直接提交到 GitHub Issue。

## 何时使用

- 用户反馈宜搭平台的 Bug，需要生成标准 Bug 报告
- 用户有功能建议，需要生成规范的功能需求工单
- 用户遇到性能问题，需要生成性能问题报告
- 需要将工单提交到 `openyida/openyida` 或 `openyida/yida-skills` 仓库

## 使用方式

```bash
node {baseDir}/scripts/voc.js <描述> [--type bug|feature|performance] [--repo openyida|yida-skills] [--dry-run]
```

## 使用示例

### 示例 1：生成 Bug 报告（预览）
```bash
node {baseDir}/scripts/voc.js "客户列表页面点击导出按钮没反应" --type bug --dry-run
```

### 示例 2：生成功能建议并提交
```bash
node {baseDir}/scripts/voc.js "希望支持批量导出表单数据为 Excel" --type feature --repo yida-skills
```

### 示例 3：自动判断类型
```bash
node {baseDir}/scripts/voc.js "页面加载超过 10 秒，数据量大时卡顿严重"
```

## 参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `<描述>` | 问题或需求描述（必填） | - |
| `--type` | 工单类型：`bug` / `feature` / `performance` | 自动判断 |
| `--repo` | 目标仓库：`openyida` / `yida-skills` | 自动判断 |
| `--dry-run` | 预览模式，只输出文案不提交 | false |

## 输出格式

### Bug 报告模板
```markdown
## Bug 描述
<用户描述>

## 复现步骤
（请补充复现步骤）
1.
2.
3.

## 期望行为
（请描述期望的正确行为）

## 实际行为
（请描述实际发生的错误行为）

## 环境信息
- OS：
- 浏览器：
- 宜搭版本：
```

### 功能建议模板
```markdown
## 需求描述
<用户描述>

## 期望功能
（请补充详细的期望功能描述）

## 使用场景
（请描述此功能的使用场景和价值）

## 优先级
中
```

### 性能问题模板
```markdown
## 性能问题描述
<用户描述>

## 复现条件
- 数据量：
- 操作路径：
- 触发频率：

## 性能指标
- 当前耗时：
- 期望耗时：

## 环境信息
- OS：
- 浏览器：
- 网络环境：
```

## 文件结构

```
yida-voc/
├── SKILL.md           # 本文档
└── scripts/
    └── voc.js         # 核心脚本
```
