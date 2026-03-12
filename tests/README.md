# yida-skills 测试套件

## 目录结构

```
tests/
├── package.json              # 测试依赖配置
├── jest.config.js           # Jest 配置
├── unit/                    # 单元测试
│   ├── fetch-with-retry.test.js   # fetch-with-retry 模块测试
│   ├── i18n.test.js              # i18n 模块测试
│   ├── regression.test.js         # 回归测试
│   └── python.test.py            # Python 脚本测试
├── integration/             # 集成测试
│   └── scripts.test.js     # 脚本集成测试
└── __mocks__/              # Mock 文件
```

## 运行测试

### 安装依赖

```bash
cd tests
npm install
```

### 运行所有测试

```bash
npm test
```

### 运行单元测试

```bash
npm run test:unit
```

### 运行集成测试

```bash
npm run test:integration
```

### 监听模式

```bash
npm run test:watch
```

### 生成覆盖率报告

```bash
npm run test:coverage
```

## 测试覆盖范围

### 已覆盖

- [x] `shared/fetch-with-retry.js` - Cookie 解析、baseUrl 解析、错误类型判断
- [x] `shared/i18n.js` - 国际化文本处理
- [x] `scripts/*` - 参数验证逻辑
- [x] 历史 Bug 回归测试

### 待覆盖

- [ ] `yida-login/scripts/login.py` - 登录流程
- [ ] `yida-logout/scripts/logout.py` - 登出流程
- [ ] `yida-publish-page/scripts/publish.js` - 发布流程
- [ ] 端到端集成测试

## 回归测试

回归测试验证以下已修复的 Bug：

- Bug #50: logout.py 日志输出走 stdout 而非 stderr
- Bug #49: publish.js 的 HTTP 请求函数缺少 timeout 配置
- Bug #44: create-form-page.js 中日志输出使用 console.log 污染 stdout
- Bug #45: CI JS 语法校验 glob 不覆盖 shared 目录
- Bug #38: CI 中 JSON 校验命令存在 Bug

## CI 集成

测试已集成到 GitHub Actions，每次 PR 和 Push 都会自动运行。

```yaml
# .github/workflows/ci.yml (已存在)
- name: Run tests
  run: |
    cd tests
    npm install
    npm test
```

## 添加新测试

1. 单元测试: `tests/unit/<module>.test.js`
2. 集成测试: `tests/integration/<feature>.test.js`
3. 回归测试: `tests/unit/regression.test.js`
