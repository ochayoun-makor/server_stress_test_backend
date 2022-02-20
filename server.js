const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const http = require('http').createServer(app);
const { ws_connection } = require('./services/web_service');
const corsOptions = {
  origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
  credentials: true,
};

app.use(cors(corsOptions));

ws_connection();

const port = process.env.PORT || 3030;
http.listen(port, () => {
  console.log('server is running on port', port);
});
