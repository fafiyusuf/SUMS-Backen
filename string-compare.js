process.env.CORS_ORIGIN = '"https://sums-web.vercel.app"';
const config = require('./dist/config/env').default;
const parsedOrigin = config.cors.origin[0];
const targetOrigin = "https://sums-web.vercel.app";

console.log("Parsed length:", parsedOrigin.length);
console.log("Target length:", targetOrigin.length);
console.log("Strict equality:", parsedOrigin === targetOrigin);

const cors = require('cors');
const express = require('express');
const app = express();
app.options('*', cors({ origin: config.cors.origin, credentials: true }));
const server = app.listen(5555, () => {
   const http = require('http');
   const req = http.request({
     hostname: 'localhost',
     port: 5555,
     path: '/api',
     method: 'OPTIONS',
     headers: {
       'Origin': 'https://sums-web.vercel.app',
       'Access-Control-Request-Method': 'POST'
     }
   }, (res) => {
     console.log("STATUS:", res.statusCode);
     console.log("HEADERS:", res.headers);
     process.exit(0);
   });
   req.end();
});
