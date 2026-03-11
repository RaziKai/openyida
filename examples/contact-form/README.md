# 留资表单示例

完整的留资表单示例，展示如何在自定义页面中收集用户输入并存储到后端表单。

## 文件说明

| 文件 | 说明 |
|------|------|
| `fields.json` | 表单字段定义 |
| `contact-page.js` | 自定义页面源码 |
| `README.md` | 本文件 |

## 使用步骤

### 1. 创建表单

```bash
cd ../skills/yida-create-form-page/scripts
node create-form-page.js create "APP_ID" "留资表单" ../../examples/contact-form/fields.json
```

记下输出的 `formUuid`，例如 `FORM_ABC123`

### 2. 配置页面代码

编辑 `contact-page.js`，替换：

```javascript
const formUuid = 'FORM_YOUR_FORM_UUID';
```

为实际的 formUuid：

```javascript
const formUuid = 'FORM_ABC123';
```

### 3. 创建自定义页面

```bash
cd ../yida-create-page/scripts
node create-page.js "APP_ID" "联系我们"
```

记下输出的页面 formUuid

### 4. 发布页面

```bash
cd ../yida-publish-page/scripts
node publish.js "APP_ID" "PAGE_FORM_UUID" ../../examples/contact-form/contact-page.js
```

## 核心代码说明

### 表单数据存储

```javascript
self.utils.yida.saveFormData({
  formUuid: 'FORM_XXX',
  appType: 'APP_XXX',
  formDataJson: JSON.stringify({
    textField_name: _customState.name,
    textField_phone: _customState.phone,
  })
}).then(function(res) {
  self.utils.toast({ title: '提交成功！', type: 'success' });
});
```

关键点：
- `formUuid`: 表单 ID
- `appType`: 应用 ID  
- `formDataJson`: JSON 字符串，键为字段 ID（textField_xxx）
