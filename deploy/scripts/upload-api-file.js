const { uploadTusFile } = require('./upload-subdomains');
const path = require('path');

const tusUrl = "https://srv710-files.hstgr.io/rest/6eb3880e6bc65984/api/tus";
const authKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJsb2NhbGUiOiJlbl9VUyIsInZpZXdNb2RlIjoibGlzdCIsInNpbmdsZUNsaWNrIjpmYWxzZSwicmVkaXJlY3RBZnRlckNvcHlNb3ZlIjpmYWxzZSwicGVybSI6eyJhZG1pbiI6ZmFsc2UsImV4ZWN1dGUiOmZhbHNlLCJjcmVhdGUiOnRydWUsInJlbmFtZSI6dHJ1ZSwibW9kaWZ5Ijp0cnVlLCJkZWxldGUiOnRydWUsInNoYXJlIjpmYWxzZSwiZG93bmxvYWQiOnRydWV9LCJjb21tYW5kcyI6W10sImxvY2tQYXNzd29yZCI6dHJ1ZSwiaGlkZURvdGZpbGVzIjpmYWxzZSwiZGF0ZUZvcm1hdCI6ZmFsc2UsInVzZXJuYW1lIjoidTkyMDU0MzQzOSIsImFjZUVkaXRvclRoZW1lIjoiIn0sImlzcyI6IkZpbGUgQnJvd3NlciIsImV4cCI6MTc5MDEwMDE0MiwiaWF0IjoxNzkwMDc4NTQyfQ.T79vygEcpBbmzyipNSfHKQNfX5qSE-1wXcR-6sKqA_s";
const restAuthKey = "855dfd26476b02407816c3bf8989481d3895e1fc47f3ae6c3dc910ec68c05560-6eb3880e6bc65984";

async function main() {
  const localIndexPath = path.join(__dirname, '../../public/api/index.php');
  console.log("Uploading index.php to api.ksavaluers.com...");
  await uploadTusFile(localIndexPath, 'index.php', tusUrl, authKey, restAuthKey);
  console.log("🎉 index.php uploaded to api.ksavaluers.com successfully!");
}

main().catch(console.error);
