const sharp = require('sharp');
const axios = require('axios');

/**
 * 清除图片元数据API
 * 
 * 使用方法：
 * POST /api/clean
 * Body: { "imageUrl": "图片URL" }
 * 
 * 返回：{ "success": true, "image": "data:image/jpeg;base64,..." }
 */
module.exports = async (req, res) => {
  // 允许跨域（让Coze可以调用）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求（浏览器预检）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: '只支持POST请求',
      usage: 'POST /api/clean with body: { "imageUrl": "..." }' 
    });
  }

  try {
    const { imageUrl } = req.body;
    
    // 检查是否提供了图片URL
    if (!imageUrl) {
      return res.status(400).json({ 
        error: '缺少imageUrl参数',
        example: { imageUrl: 'https://example.com/image.jpg' }
      });
    }

    console.log('开始处理图片:', imageUrl);

    // 1. 下载图片（10秒超时）
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('图片下载成功，大小:', response.data.length, 'bytes');
    
    // 2. 使用Sharp清除所有元数据
    const cleanedBuffer = await sharp(response.data)
      .withMetadata({
        // 清除所有元数据
        exif: {},      // 清除EXIF（相机信息、GPS等）
        icc: false,    // 清除ICC色彩配置
        iptc: false,   // 清除IPTC（版权、关键词等）
        xmp: false     // 清除XMP（Adobe元数据）
      })
      .jpeg({ quality: 90 })  // 转为JPEG，保持高质量
      .toBuffer();
    
    console.log('元数据清除成功，新大小:', cleanedBuffer.length, 'bytes');
    
    // 3. 转换为Base64（Coze和Sora都支持）
    const base64 = cleanedBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    
    // 4. 返回结果
    return res.status(200).json({
      success: true,
      message: '元数据清除成功',
      image: dataUri,
      originalSize: response.data.length,
      cleanedSize: cleanedBuffer.length,
      reduction: `${((1 - cleanedBuffer.length / response.data.length) * 100).toFixed(2)}%`
    });
    
  } catch (error) {
    console.error('处理失败:', error.message);
    
    // 返回详细错误信息
    return res.status(500).json({ 
      error: '图片处理失败',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

