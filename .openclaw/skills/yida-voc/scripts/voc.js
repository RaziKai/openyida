#!/usr/bin/env node
/**
 * yida-voc: 宜搭 VOC 工单规范化
 *
 * 用法：
 *   node voc.js <描述> [--type bug|feature|performance] [--repo openyida|yida-skills] [--dry-run]
 *
 * 根据用户描述自动生成标准格式的宜搭工单文案，并可通过 gh CLI 提交到 GitHub Issue。
 */

"use strict";

const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

// ── 路由规则 ──────────────────────────────────────────────────────────

const OPENYIDA_KEYWORDS = [
  "cli", "命令行", "命令", "install", "安装脚本", "安装",
  "workflow", "ci", "cd", "github action", "贡献者", "contributor",
  "readme", "package", "npm", "发布工具", "版本管理",
  "openclaw", "openyida", "bin/yida", "yida shell", "yida config",
];

const YIDA_SKILLS_KEYWORDS = [
  "登录", "登出", "login", "logout", "扫码", "cookie", "token", "csrf",
  "创建应用", "创建页面", "创建表单", "发布页面", "发布", "publish",
  "schema", "宜搭 api", "宜搭api", "skill", "表单", "应用", "页面",
  "宜搭", "aliwork", "yida-create", "yida-publish", "yida-get",
  "get-schema", "create-app", "create-page", "create-form",
  "批量", "导出", "字段", "数据", "接口",
];

function detectTargetRepo(description) {
  const lowerDesc = description.toLowerCase();
  let openyidaScore = 0;
  let yidaSkillsScore = 0;

  for (const keyword of OPENYIDA_KEYWORDS) {
    if (lowerDesc.includes(keyword.toLowerCase())) openyidaScore++;
  }
  for (const keyword of YIDA_SKILLS_KEYWORDS) {
    if (lowerDesc.includes(keyword.toLowerCase())) yidaSkillsScore++;
  }

  if (openyidaScore === 0 && yidaSkillsScore === 0) return null;
  if (openyidaScore > yidaSkillsScore) return "openyida/openyida";
  if (yidaSkillsScore > openyidaScore) return "openyida/yida-skills";
  return null;
}

// ── 类型判断 ──────────────────────────────────────────────────────────

function detectIssueType(description) {
  const lowerDesc = description.toLowerCase();

  const performanceKeywords = [
    "慢", "卡", "卡顿", "超时", "性能", "加载慢", "响应慢", "耗时", "延迟",
    "timeout", "slow", "performance", "lag", "freeze",
  ];
  for (const keyword of performanceKeywords) {
    if (lowerDesc.includes(keyword)) return "performance";
  }

  const bugKeywords = [
    "bug", "错误", "报错", "失败", "异常", "不生效", "不显示", "崩溃",
    "修复", "fix", "没反应", "无法", "不能", "不对", "问题",
  ];
  for (const keyword of bugKeywords) {
    if (lowerDesc.includes(keyword)) return "bug";
  }

  return "feature";
}

// ── 标题生成 ──────────────────────────────────────────────────────────

function generateTitle(description, issueType) {
  const cleanDesc = description
    .replace(/^(bug|feat|feature|fix|perf|performance)\s*[:：]\s*/i, "")
    .trim();

  switch (issueType) {
    case "bug":
      return `bug: ${cleanDesc}`;
    case "performance":
      return `perf: ${cleanDesc}`;
    default:
      return `[Feature] ${cleanDesc}`;
  }
}

// ── 工单文案生成 ──────────────────────────────────────────────────────

function generateBody(description, issueType, targetRepo) {
  const repoLabel = targetRepo === "openyida/openyida"
    ? "平台工具（CLI / CI / 安装脚本等）"
    : "宜搭操作能力（登录 / 创建应用 / 发布 / Schema 等）";

  const footer = `\n---\n> 此 Issue 由 [yida-voc skill](https://github.com/openyida/openyida/tree/main/.openclaw/skills/yida-voc) 自动创建，路由到 **${repoLabel}**。`;

  switch (issueType) {
    case "bug":
      return `## Bug 描述

${description}

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
- 相关版本：
${footer}`;

    case "performance":
      return `## 性能问题描述

${description}

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
${footer}`;

    default:
      return `## 需求描述

${description}

## 期望功能

（请补充详细的期望功能描述）

## 使用场景

（请描述此功能的使用场景和价值）

## 优先级

中
${footer}`;
  }
}

// ── 参数解析 ──────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const options = {
    description: "",
    repo: null,
    type: null,
    dryRun: false,
  };

  const descParts = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--repo" && args[i + 1]) {
      const repoArg = args[++i].toLowerCase();
      if (repoArg === "openyida") {
        options.repo = "openyida/openyida";
      } else if (repoArg === "yida-skills") {
        options.repo = "openyida/yida-skills";
      } else {
        console.error(`❌ 无效的 --repo 参数：${repoArg}，可选值：openyida | yida-skills`);
        process.exit(1);
      }
    } else if (args[i] === "--type" && args[i + 1]) {
      const typeArg = args[++i].toLowerCase();
      if (["bug", "feature", "feat", "performance", "perf"].includes(typeArg)) {
        if (typeArg === "feat") options.type = "feature";
        else if (typeArg === "perf") options.type = "performance";
        else options.type = typeArg;
      } else {
        console.error(`❌ 无效的 --type 参数：${typeArg}，可选值：bug | feature | performance`);
        process.exit(1);
      }
    } else if (args[i] === "--dry-run") {
      options.dryRun = true;
    } else if (!args[i].startsWith("--")) {
      descParts.push(args[i]);
    }
  }

  options.description = descParts.join(" ").trim();
  return options;
}

// ── 主流程 ────────────────────────────────────────────────────────────

function main() {
  const options = parseArgs(process.argv);

  if (!options.description) {
    console.error("❌ 请提供问题或需求描述");
    console.error("");
    console.error("用法：");
    console.error("  node voc.js <描述> [--type bug|feature|performance] [--repo openyida|yida-skills] [--dry-run]");
    console.error("");
    console.error("示例：");
    console.error('  node voc.js "客户列表页面点击导出按钮没反应" --type bug --dry-run');
    console.error('  node voc.js "希望支持批量导出表单数据" --type feature --repo yida-skills');
    console.error('  node voc.js "页面加载超过 10 秒，数据量大时卡顿严重"');
    process.exit(1);
  }

  console.log("🔍 分析工单内容...");
  console.log(`   描述：${options.description}`);
  console.log("");

  // 判断目标仓库
  let targetRepo = options.repo || detectTargetRepo(options.description);
  if (!targetRepo) {
    console.log("⚠️  无法自动判断目标仓库，请手动指定：");
    console.log("");
    console.log("  --repo openyida      → openyida/openyida（CLI、CI/CD、安装脚本等平台工具）");
    console.log("  --repo yida-skills   → openyida/yida-skills（宜搭操作能力：登录/创建/发布/Schema）");
    console.log("");
    console.log("示例：");
    console.log(`  node voc.js "${options.description}" --repo yida-skills`);
    process.exit(1);
  }

  // 判断工单类型
  const issueType = options.type || detectIssueType(options.description);

  // 生成标题和 body
  const title = generateTitle(options.description, issueType);
  const body = generateBody(options.description, issueType, targetRepo);

  const typeLabel = { bug: "🐛 Bug", feature: "✨ Feature", performance: "⚡ Performance" }[issueType];
  const repoLabel = targetRepo === "openyida/openyida"
    ? "平台工具（CLI / CI / 安装脚本等）"
    : "宜搭操作能力（登录 / 创建应用 / 发布 / Schema 等）";

  console.log(`📦 目标仓库：${targetRepo}（${repoLabel}）`);
  console.log(`📝 工单类型：${typeLabel}`);
  console.log(`📌 标题：${title}`);
  console.log("");

  if (options.dryRun) {
    console.log("🔍 [dry-run 模式] 工单内容预览：");
    console.log("─".repeat(60));
    console.log(body);
    console.log("─".repeat(60));
    console.log("");
    console.log("✅ dry-run 完成，未实际创建 Issue");
    return;
  }

  // 检查 gh CLI 是否可用
  try {
    execSync("gh --version", { stdio: "pipe" });
  } catch {
    console.error("❌ 未找到 gh CLI，请先安装：https://cli.github.com/");
    process.exit(1);
  }

  // 用临时文件传 body，避免 shell 转义导致换行符丢失
  console.log("🚀 正在创建 Issue...");
  const bodyTempFile = path.join(os.tmpdir(), `yida-voc-body-${Date.now()}.md`);
  try {
    fs.writeFileSync(bodyTempFile, body, "utf-8");

    const ghLabel = { bug: "bug", feature: "enhancement", performance: "enhancement" }[issueType];

    try {
      const result = execSync(
        `gh issue create --repo "${targetRepo}" --title "${title.replace(/"/g, '\\"')}" --body-file "${bodyTempFile}" --label "${ghLabel}"`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      );
      console.log(`✅ Issue 创建成功：${result.trim()}`);
    } catch {
      // label 不存在时降级为不带 label 创建
      const result = execSync(
        `gh issue create --repo "${targetRepo}" --title "${title.replace(/"/g, '\\"')}" --body-file "${bodyTempFile}"`,
        { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
      );
      console.log(`✅ Issue 创建成功：${result.trim()}`);
    }
  } catch (error) {
    console.error(`❌ 创建 Issue 失败：${error.message}`);
    console.error("请确认：");
    console.error("  1. gh CLI 已登录（gh auth login）");
    console.error("  2. 你有对应仓库的访问权限");
    process.exit(1);
  } finally {
    try { fs.unlinkSync(bodyTempFile); } catch {}
  }
}

main();
