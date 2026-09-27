const https = require('https');

const options = {
  hostname: 'api.ksavaluers.com',
  port: 443,
  path: '/api/v1/auth/me',
  method: 'GET',
  headers: {
    'Origin': 'https://dashboard.ksavaluers.com',
    'Cookie': 'ksa_access=token_acc_da8b671379eebddc418148a6614e5e66'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response Body:', data);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.end();
