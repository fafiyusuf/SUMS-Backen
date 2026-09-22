console.log('Test 1: ' + '"https://sums-web.vercel.app"'.split(',').map(o => o.trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')));
console.log('Test 2: ' + '"https://sums-web.vercel.app,http://localhost:3000"'.split(',').map(o => o.trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')));
console.log('Test 3: ' + 'https://sums-web.vercel.app/,http://localhost:3000/'.split(',').map(o => o.trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')));
