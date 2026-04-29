const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const Member = require('../server/models/Member');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const members = await Member.find({});
  console.log('Members count:', members.length);
  if (members.length > 0) {
    console.log('First member:', members[0].memberId, members[0].username, members[0].email, members[0].role);
  }
  process.exit(0);
}).catch(e => {
  console.log(e);
  process.exit(1);
});
