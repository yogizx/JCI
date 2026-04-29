const http = require('http');
const mongoose = require('mongoose');

// Mock request to login to test if it works. Since we don't have a known user/password,
// We will just read the database and create a token to test the profile endpoint.
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    id: new mongoose.Types.ObjectId().toString(),
    role: 'Member',
    memberId: 'TEST-ID',
    username: 'testuser',
  },
  'jci_madurai_secret_key_2026',
  { expiresIn: '8h' }
);

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
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.end();
