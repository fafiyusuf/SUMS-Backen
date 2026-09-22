const express = require('express');
const cors = require('cors');
const app = express();
app.options('*', cors({ origin: ['https://other.com'] }));
app.listen(4445, async () => {
  const { exec } = require('child_process');
  exec('curl -i -X OPTIONS http://localhost:4445/api -H "Origin: https://sums-web.vercel.app" -H "Access-Control-Request-Method: POST"', (err, stdout) => {
    console.log("NON-MATCHING ARRAY ORIGIN:\n", stdout);
    app.close();
    process.exit();
  });
});
