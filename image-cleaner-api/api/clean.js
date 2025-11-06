const axios = require('axios');

/**
 * 清除图片元数据API
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: '只支持POST请求',
      usage: 'POST /api/clean with body: { "imageUrl": "..." }' 
    });
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch (error) {
    console.error('Sharp加载失败:', error);
    return res.status(500).json({ 
      error: 'Sharp库加载失败',
      details: error.message 
    });
  }

  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ 
        error: '缺少imageUrl参数',
        example: { imageUrl: 'https://example.com/image.jpg' }
      });
    }

    console.log('开始处理图片:', imageUrl);

    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('图片下载成功，大小:', response.data.length, 'bytes');
    
    const cleanedBuffer = await sharp(response.data)
      .rotate()
      .withMetadata({
        exif: {},
        icc: false,
        iptc: false,
        xmp: false
      })
      .jpeg({ 
        quality: 90,
        mozjpeg: true
      })
      .toBuffer();
    
    console.log('元数据清除成功，新大小:', cleanedBuffer.length, 'bytes');
    
    const base64 = cleanedBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    
    return res.status(200).json({
      success: true,
      message: '元数据清除成功',
      image: dataUri,
      originalSize: response.data.length,
      cleanedSize: cleanedBuffer.length,
      reduction: `${((1 - cleanedBuffer.length / response.data.length) * 100).toFixed(2)}%`
    });
    
  } catch (error) {
    console.error('处理失败:', error);
    
    return res.status(500).json({ 
      error: '图片处理失败',
      details: error.message,
      type: error.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
