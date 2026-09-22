process.env.CORS_ORIGIN = '"https://sums-web.vercel.app"';
const config = require('./dist/config/env').default;
console.log(config.cors.origin);
console.log(config.cors.origin.includes('https://sums-web.vercel.app'));
