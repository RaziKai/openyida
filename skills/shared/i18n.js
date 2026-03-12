#!/usr/bin/env node
/**
 * i18n.js - 轻量国际化公共模块
 *
 * 语言优先级：
 * 1. 环境变量 YIDA_LANG（如 YIDA_LANG=en）
 * 2. config.json 中的 lang 字段
 * 3. 默认中文（zh）
 *
 * 用法：
 *   const { t } = require('../../shared/i18n');
 *   console.error(t('loginSuccess'));
 *
 * 支持的语言：zh（中文）、en（英文）
 */

"use strict";

const fs = require("fs");
const path = require("path");

// ── 查找项目根目录 ────────────────────────────────────────────────────

function findProjectRoot() {
  for (const startDir of [process.cwd(), __dirname]) {
    let currentDir = startDir;
    while (currentDir !== path.dirname(currentDir)) {
      if (
        fs.existsSync(path.join(currentDir, "README.md")) ||
        fs.existsSync(path.join(currentDir, ".git"))
      ) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
  }
  return process.cwd();
}

// ── 语言检测 ──────────────────────────────────────────────────────────

function detectLanguage() {
  // 1. 环境变量优先
  const envLang = process.env.YIDA_LANG;
  if (envLang && ["zh", "en"].includes(envLang.toLowerCase())) {
    return envLang.toLowerCase();
  }

  // 2. config.json 中的 lang 字段
  try {
    const configPath = path.join(findProjectRoot(), "config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.lang && ["zh", "en"].includes(config.lang.toLowerCase())) {
        return config.lang.toLowerCase();
      }
    }
  } catch {
    // 忽略配置读取错误
  }

  // 3. 默认中文
  return "zh";
}

// ── 翻译字典 ──────────────────────────────────────────────────────────

const messages = {
  zh: {
    // 通用
    loading: "加载中...",
    success: "成功",
    failed: "失败",
    error: "错误",
    warning: "警告",

    // 登录相关
    loginSuccess: "✅ 登录成功",
    loginFailed: "❌ 登录失败",
    loginRequired: "🔐 需要登录，正在启动登录流程...",
    loginExpired: "⚠️  Cookie 已失效，正在重新登录...",
    loginScriptNotFound: "❌ 登录脚本不存在",
    loginResultParseError: "❌ 解析登录结果失败",
    csrfExpired: "🔄 CSRF Token 已过期，正在刷新...",
    csrfRefreshFailed: "❌ 刷新 CSRF Token 失败",
    cookieLoaded: "✅ 登录态已就绪",
    cookieNotFound: "⚠️  未找到本地登录态，触发登录...",

    // 请求重试
    requestTimeout: "请求超时",
    retrying: (attempt, max, waitMs) => `  ⚠️  请求失败，${waitMs}ms 后重试（${attempt}/${max}）...`,
    retryExhausted: (max) => `  ❌  重试 ${max} 次后仍失败，请检查网络连接`,

    // 应用创建
    createAppTitle: "yida-create-app - 宜搭应用创建工具",
    createAppSuccess: "✅ 应用创建成功！",
    createAppFailed: "❌ 创建失败",
    appName: "应用名称",
    appDesc: "应用描述",
    appIcon: "图标",
    appType: "应用 ID",
    appUrl: "访问地址",

    // 页面创建
    createPageTitle: "yida-create-page - 宜搭页面创建工具",
    createPageSuccess: "✅ 页面创建成功！",
    createPageFailed: "❌ 页面创建失败",

    // 表单创建
    createFormTitle: "yida-create-form - 宜搭表单创建工具",
    createFormSuccess: "✅ 表单创建成功！",
    createFormFailed: "❌ 表单创建失败",

    // 发布
    publishTitle: "yida-publish - 宜搭页面发布工具",
    publishSuccess: "✅ 发布成功！",
    publishFailed: "❌ 发布失败",

    // Schema
    getSchemaTitle: "yida-get-schema - 获取表单 Schema",
    getSchemaSuccess: "✅ Schema 获取成功",
    getSchemaFailed: "❌ Schema 获取失败",

    // 通用步骤
    stepReadAuth: "🔑 读取登录态",
    stepSendRequest: "📤 发送请求",
    stepDone: "✅ 完成",
  },

  en: {
    // General
    loading: "Loading...",
    success: "Success",
    failed: "Failed",
    error: "Error",
    warning: "Warning",

    // Auth
    loginSuccess: "✅ Login successful",
    loginFailed: "❌ Login failed",
    loginRequired: "🔐 Login required, starting login flow...",
    loginExpired: "⚠️  Cookie expired, re-logging in...",
    loginScriptNotFound: "❌ Login script not found",
    loginResultParseError: "❌ Failed to parse login result",
    csrfExpired: "🔄 CSRF Token expired, refreshing...",
    csrfRefreshFailed: "❌ Failed to refresh CSRF Token",
    cookieLoaded: "✅ Auth ready",
    cookieNotFound: "⚠️  No local auth found, triggering login...",

    // Retry
    requestTimeout: "Request timeout",
    retrying: (attempt, max, waitMs) => `  ⚠️  Request failed, retrying in ${waitMs}ms (${attempt}/${max})...`,
    retryExhausted: (max) => `  ❌  Failed after ${max} retries, please check your network`,

    // App creation
    createAppTitle: "yida-create-app - Yida App Creator",
    createAppSuccess: "✅ App created successfully!",
    createAppFailed: "❌ App creation failed",
    appName: "App name",
    appDesc: "Description",
    appIcon: "Icon",
    appType: "App ID",
    appUrl: "URL",

    // Page creation
    createPageTitle: "yida-create-page - Yida Page Creator",
    createPageSuccess: "✅ Page created successfully!",
    createPageFailed: "❌ Page creation failed",

    // Form creation
    createFormTitle: "yida-create-form - Yida Form Creator",
    createFormSuccess: "✅ Form created successfully!",
    createFormFailed: "❌ Form creation failed",

    // Publish
    publishTitle: "yida-publish - Yida Page Publisher",
    publishSuccess: "✅ Published successfully!",
    publishFailed: "❌ Publish failed",

    // Schema
    getSchemaTitle: "yida-get-schema - Get Form Schema",
    getSchemaSuccess: "✅ Schema retrieved successfully",
    getSchemaFailed: "❌ Failed to get Schema",

    // Steps
    stepReadAuth: "🔑 Reading auth",
    stepSendRequest: "📤 Sending request",
    stepDone: "✅ Done",
  },
};

// ── 翻译函数 ──────────────────────────────────────────────────────────

const currentLang = detectLanguage();

/**
 * 翻译函数
 * @param {string} key - 翻译 key
 * @param {...any} args - 动态参数（用于函数类型的翻译值）
 * @returns {string} 翻译后的字符串
 */
function t(key, ...args) {
  const langMessages = messages[currentLang] || messages.zh;
  const fallbackMessages = messages.zh;

  const value = langMessages[key] ?? fallbackMessages[key];

  if (value === undefined) {
    return key; // 找不到翻译时返回 key 本身
  }

  if (typeof value === "function") {
    return value(...args);
  }

  return value;
}

/**
 * 获取当前语言
 */
function getLang() {
  return currentLang;
}

module.exports = { t, getLang, messages, detectLanguage };
