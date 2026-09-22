process.env.CORS_ORIGIN = '"https://sums-web.vercel.app"';
const config = require('./dist/config/env').default;
console.log("PARSED CORS:", config.cors.origin);

const express = require('express');
const app = require('./dist/app').default;

const server = app.listen(4447, async () => {
  const { execSync } = require('child_process');
  try {
     const stdout = execSync('curl -s -i -X OPTIONS http://localhost:4447/api/v1/auth/login/admin -H "Origin: https://sums-web.vercel.app" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type,authorization"');
     console.log("MATCHING ORIGIN:\n" + stdout.toString());
  } catch (e) {
     console.error(e.message);
  }
  server.close();
});
