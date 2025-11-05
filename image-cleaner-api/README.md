# 图片元数据清除API

🎯 **专为Sora图生视频优化** - 清除Coze生成图片的元数据，避免Sora审核失败

## ✨ 功能特性

- ✅ 完全清除EXIF、IPTC、XMP、ICC等所有元数据
- ✅ 支持从URL直接下载并处理图片
- ✅ 返回Base64格式，可直接用于Sora
- ✅ 自动压缩优化，减小文件体积
- ✅ 支持跨域调用（CORS）
- ✅ 完全免费，无限制使用

## 🚀 快速部署（3分钟）

### 方法1: 使用Vercel（推荐）

1. **注册Vercel账号**
   - 访问 https://vercel.com
   - 用GitHub账号登录（免费）

2. **安装Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **部署**
   ```bash
   cd image-cleaner-api
   vercel login
   vercel --prod
   ```

4. **完成！**
   - 部署成功后会得到一个网址，例如：
   - `https://image-cleaner-api.vercel.app`

### 方法2: 使用GitHub导入（更简单）

1. 把这个文件夹上传到GitHub
2. 访问 https://vercel.com/new
3. 点击"Import Git Repository"
4. 选择你的仓库
5. 点击"Deploy"
6. 完成！

## 📖 使用方法

### API端点

```
POST https://your-api.vercel.app/api/clean
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg"
}
```

### 返回结果

```json
{
  "success": true,
  "message": "元数据清除成功",
  "image": "data:image/jpeg;base64,...",
  "originalSize": 123456,
  "cleanedSize": 98765,
  "reduction": "20.00%"
}
```

## 🔧 在Coze中使用

### HTTP请求节点配置

```json
{
  "method": "POST",
  "url": "https://your-api.vercel.app/api/clean",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "imageUrl": "{{coze生成的图片URL}}"
  }
}
```

### 完整工作流

```
节点4: 生成image_prompt
  ↓
节点5: 用image_prompt生成图片（Coze插件）
  ↓
【新增】节点6: 调用清理API
  - URL: https://your-api.vercel.app/api/clean
  - Body: { "imageUrl": "{{节点5的图片URL}}" }
  ↓
节点7: 用清理后的图片 + video_prompt生成Sora视频
  - 图片: {{节点6.response.image}}
  - 提示词: {{节点4的video_prompt}}
```

## 🧪 测试

访问你的API首页（例如 https://your-api.vercel.app）
点击"测试API"按钮即可

## 💰 费用

完全免费！Vercel免费版额度：
- 每月100GB带宽
- 每月100GB边缘函数执行时间
- 无限制请求次数

个人使用绰绰有余！

## 🛠️ 技术栈

- Node.js 18+
- Sharp (图片处理)
- Axios (HTTP请求)
- Vercel (部署平台)

## 📝 许可证

MIT License - 完全免费使用

