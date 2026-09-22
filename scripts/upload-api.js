const fs = require('fs');
const path = require('path');
const https = require('https');

const uploadUrl = "https://srv710-files.hstgr.io/rest/76626b7e9a269348/api/tus/public_html";
const authKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTkyMDU0MzQzOSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDA1NzA3MiwiaWF0IjoxNzkwMDM1NDcyfQ.xHsUIvCIMpLKt95Wjop8fbRcH8COIO5GC9v4lkRVy64";
const restAuthKey = "5995507e624360533f1f99b0884ba5a492b69443e505f12baf8401eaca7f5465-76626b7e9a269348";

async function uploadFile(localPath, remoteRelativePath) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  const targetUrl = `${uploadUrl}/${remoteRelativePath}?override=true`;

  console.log(`Starting TUS upload for ${localPath} (${size} bytes) -> ${remoteRelativePath}...`);

  // Step 1: POST (Create)
  await new Promise((resolve, reject) => {
    const req = https.request(targetUrl, {
      method: 'POST',
      headers: {
        'X-Auth': authKey,
        'X-Auth-Rest': restAuthKey,
        'Tus-Resumable': '1.0.0',
        'Upload-Length': size.toString(),
        'Upload-Offset': '0'
      }
    }, (res) => {
      console.log(`POST response status: ${res.statusCode}`);
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', reject);
    req.end();
  });

  // Step 2: PATCH (Upload bytes)
  await new Promise((resolve, reject) => {
    const req = https.request(targetUrl, {
      method: 'PATCH',
      headers: {
        'X-Auth': authKey,
        'X-Auth-Rest': restAuthKey,
        'Tus-Resumable': '1.0.0',
        'Content-Type': 'application/offset+octet-stream',
        'Upload-Offset': '0',
        'Content-Length': size.toString()
      }
    }, (res) => {
      console.log(`PATCH response status: ${res.statusCode}`);
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });

  console.log(`✅ Upload complete for ${remoteRelativePath}`);
}

async function main() {
  await uploadFile(path.join(__dirname, '../public/api/index.php'), 'api/index.php');
  await uploadFile(path.join(__dirname, '../public/api/.htaccess'), 'api/.htaccess');
}

main().catch(console.error);
