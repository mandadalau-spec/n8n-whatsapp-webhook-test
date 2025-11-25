// 導入 Express.js
const express = require('express');

// 建立一個 Express 應用程式
const app = express();

// 用於解析 JSON 請求體的中間件
app.use(express.json());

// 設定連接埠和驗證令牌
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// GET 請求的路由（用於 Meta 驗證）
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// POST 請求的路由（用於接收 WhatsApp 訊息）
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\nWebhook received at ${timestamp}:`);
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`\nServer running on port ${port}\n`);
});
