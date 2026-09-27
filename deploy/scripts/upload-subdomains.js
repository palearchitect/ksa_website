const fs = require('fs');
const path = require('path');
const https = require('https');

// Helper function to upload file via TUS protocol
async function uploadTusFile(localPath, remoteRelativePath, tusUrl, authKey, restAuthKey) {
  const content = fs.readFileSync(localPath);
  const size = content.length;
  const targetUrl = `${tusUrl}/${remoteRelativePath}?override=true`;

  console.log(`Uploading ${remoteRelativePath} (${size} bytes)...`);

  // Step 1: POST (Create file slot)
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
      res.on('data', () => { });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`POST failed with status ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });

  // Step 2: PATCH (Upload content)
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
      res.on('data', () => { });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`PATCH failed with status ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(content);
    req.end();
  });

  console.log(`✅ Uploaded ${remoteRelativePath}`);
}

async function uploadDir(dirPath, baseDir, tusUrl, authKey, restAuthKey) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      await uploadDir(fullPath, baseDir, tusUrl, authKey, restAuthKey);
    } else {
      await uploadTusFile(fullPath, relativePath, tusUrl, authKey, restAuthKey);
    }
  }
}

module.exports = { uploadTusFile, uploadDir };
