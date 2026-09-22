const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors({ origin: ['https://other.com'], credentials: true }));
const server = app.listen(4446, async () => {
  const { exec } = require('child_process');
  exec('curl -i -X OPTIONS http://localhost:4446/api -H "Origin: https://sums-web.vercel.app" -H "Access-Control-Request-Method: POST"', (err, stdout) => {
    console.log("NON-MATCHING CREDENTIALS:\n", stdout);
    server.close();
  });
});
