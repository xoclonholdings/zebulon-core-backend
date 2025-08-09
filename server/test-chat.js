// Automated test for /chat endpoint
const http = require('http');

const data = JSON.stringify({ message: 'Hello, Zed!' });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
    if (res.statusCode === 200 && body.includes('Zed says: Hello, Zed!')) {
      console.log('✅ /chat endpoint test PASSED');
      process.exit(0);
    } else {
      console.error('❌ /chat endpoint test FAILED');
      process.exit(1);
    }
  });
});

req.on('error', error => {
  console.error('❌ Request error:', error);
  process.exit(1);
});

req.write(data);
req.end();
