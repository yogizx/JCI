const http = require('http');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTEyYjE3ZmZhYjg3MTdkYTBjMmNkNSIsInJvbGUiOiJBZG1pbiIsIm1lbWJlcklkIjoiQURNSU4tMDAxIiwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTc3NzQ2NzU4NSwiZXhwIjoxNzc3NDk2Mzg1fQ._VQxZEPxpavf7F95BIA3Z45ZqhoJQAuStn0x5fAiOSQ";

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/member/profile',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + token
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log(body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
