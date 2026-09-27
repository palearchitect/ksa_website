const { uploadDir } = require('./upload-subdomains');
const path = require('path');

const targets = [
  {
    name: 'ksavaluers.com (root)',
    url: "https://srv710-files.hstgr.io/rest/2a20b696ffb76fce/api/tus/public_html",
    authKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTkyMDU0MzQzOSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDEwNTYyMywiaWF0IjoxNzkwMDg0MDIzfQ.tYYgA2GGIeFaSF7wirzeT6k0k7dxYBAc7ovmum33xFw",
    restAuthKey: "00b1e1d5747b6dbb90e04262dd73ff804b5a34a917267e04aa055efabb4118d5-2a20b696ffb76fce"
  },
  {
    name: 'dashboard.ksavaluers.com',
    url: "https://srv710-files.hstgr.io/rest/10926e5f269d7890/api/tus",
    authKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTkyMDU0MzQzOSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDEwNTU5OCwiaWF0IjoxNzkwMDgzOTk4fQ.trEiCApoQOADrQVQbJg7_QBfbpzyllc31pvyu5jtjNQ",
    restAuthKey: "6bedddd380899b509dac09bc3004c467a118299763404bbf3c7f6dabfa5f940e-10926e5f269d7890"
  },
  {
    name: 'accounts.ksavaluers.com',
    url: "https://srv710-files.hstgr.io/rest/9a85bec87fff7f11/api/tus",
    authKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTkyMDU0MzQzOSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDEwNTYxMSwiaWF0IjoxNzkwMDg0MDExfQ.UzfExI12SPZ__WfkxbQ4rmmQU3rEHt6NYHGw_igPwMU",
    restAuthKey: "e4ed8850c8543fa0ad0a1ea6335ceb103bea7321bdc91b128d8bbc193f49167a-9a85bec87fff7f11"
  }
];

async function main() {
  const distDir = path.join(__dirname, '../../dist');
  for (const target of targets) {
    console.log(`\n========================================`);
    console.log(`🚀 Uploading dist to ${target.name}...`);
    console.log(`========================================`);
    await uploadDir(distDir, distDir, target.url, target.authKey, target.restAuthKey);
    console.log(`✅ Finished ${target.name}`);
  }
  console.log('\n🎉 ALL THREE SUBDOMAINS SYNCED AND DEPLOYED SUCCESSFULLY!');
}

main().catch(console.error);
