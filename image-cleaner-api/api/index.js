/**
 * API首页 - 显示使用说明
 */
module.exports = (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>图片元数据清除API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      max-width: 800px;
      width: 100%;
      padding: 40px;
    }
    h1 { 
      color: #667eea; 
      margin-bottom: 10px;
      font-size: 2em;
    }
    .subtitle {
      color: #666;
      margin-bottom: 30px;
    }
    .endpoint {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .method {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 0.9em;
      margin-right: 10px;
    }
    code {
      background: #2d3748;
      color: #68d391;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: "Monaco", "Courier New", monospace;
      font-size: 0.9em;
    }
    pre {
      background: #2d3748;
      color: #68d391;
      padding: 20px;
      border-radius: 10px;
      overflow-x: auto;
      margin: 15px 0;
      font-family: "Monaco", "Courier New", monospace;
      font-size: 0.9em;
      line-height: 1.6;
    }
    .feature {
      display: flex;
      align-items: center;
      margin: 10px 0;
    }
    .feature::before {
      content: "✓";
      display: inline-block;
      width: 24px;
      height: 24px;
      background: #48bb78;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      margin-right: 10px;
      font-weight: bold;
    }
    .test-btn {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 1em;
      cursor: pointer;
      margin-top: 20px;
      transition: all 0.3s;
    }
    .test-btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🖼️ 图片元数据清除API</h1>
    <p class="subtitle">专为Sora图生视频优化 - 免费、快速、安全</p>
    
    <div class="endpoint">
      <h3><span class="method">POST</span> /api/clean</h3>
      <p style="margin: 15px 0;">清除图片中的所有元数据（EXIF、IPTC、XMP、ICC）</p>
      
      <h4 style="margin-top: 20px;">请求示例：</h4>
      <pre>{
  "imageUrl": "https://example.com/image.jpg"
}</pre>
      
      <h4 style="margin-top: 20px;">返回示例：</h4>
      <pre>{
  "success": true,
  "message": "元数据清除成功",
  "image": "data:image/jpeg;base64,...",
  "originalSize": 123456,
  "cleanedSize": 98765,
  "reduction": "20.00%"
}</pre>
    </div>

    <h3 style="margin-top: 30px;">✨ 功能特性</h3>
    <div class="feature">完全清除EXIF、IPTC、XMP、ICC等所有元数据</div>
    <div class="feature">支持从URL直接下载并处理图片</div>
    <div class="feature">返回Base64格式，可直接用于Sora</div>
    <div class="feature">自动压缩优化，减小文件体积</div>
    <div class="feature">支持跨域调用（CORS）</div>
    <div class="feature">完全免费，无限制使用</div>

    <h3 style="margin-top: 30px;">🚀 在Coze中使用</h3>
    <pre>// HTTP请求节点配置
{
  "method": "POST",
  "url": "${req.headers.host ? 'https://' + req.headers.host : ''}/api/clean",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "imageUrl": "{{coze生成的图片URL}}"
  }
}</pre>

    <button class="test-btn" onclick="testAPI()">🧪 测试API</button>
    <div id="result" style="margin-top: 20px;"></div>
  </div>

  <script>
    async function testAPI() {
      const btn = event.target;
      btn.textContent = '⏳ 测试中...';
      btn.disabled = true;
      
      try {
        const response = await fetch('/api/clean', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: 'https://picsum.photos/400/300'
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          document.getElementById('result').innerHTML = \`
            <div style="background: #f0fff4; border: 2px solid #48bb78; border-radius: 10px; padding: 20px; margin-top: 20px;">
              <h4 style="color: #48bb78; margin-bottom: 10px;">✓ 测试成功！</h4>
              <p>原始大小: \${data.originalSize} bytes</p>
              <p>清理后大小: \${data.cleanedSize} bytes</p>
              <p>减少了: \${data.reduction}</p>
              <img src="\${data.image}" style="max-width: 100%; margin-top: 15px; border-radius: 10px;" />
            </div>
          \`;
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        document.getElementById('result').innerHTML = \`
          <div style="background: #fff5f5; border: 2px solid #f56565; border-radius: 10px; padding: 20px; margin-top: 20px;">
            <h4 style="color: #f56565;">✗ 测试失败</h4>
            <p>\${error.message}</p>
          </div>
        \`;
      } finally {
        btn.textContent = '🧪 测试API';
        btn.disabled = false;
      }
    }
  </script>
</body>
</html>
  `;
  
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
};

