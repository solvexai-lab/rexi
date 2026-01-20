const http = require('http');

const data = JSON.stringify({
  text: "The Contractor shall indemnify the Company against any and all claims without limitation of liability. The recipient shall keep all information confidential forever."
});

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/analyze',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
