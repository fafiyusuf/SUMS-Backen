const express = require('express');
const cors = require('cors');
const app = express();
const corsOptions = { origin: ["https://sums-web.vercel.app"], credentials: true };
app.options('*', cors(corsOptions));
const server = app.listen(4447, () => {
  const { execSync } = require('child_process');
  const stdout = execSync('curl -s -i -X OPTIONS http://localhost:4447/api -H "Origin: https://sums-web.vercel.app" -H "Access-Control-Request-Method: POST"');
  require('fs').writeFileSync('cors4.out', stdout);
  server.close();
});
