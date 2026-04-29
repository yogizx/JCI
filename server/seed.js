const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const { ensureAdminAccount } = require('./utils/adminBootstrap');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    const result = await ensureAdminAccount();

    console.log(
      result.created
        ? `Admin account created with username "${result.username}" and member ID "${result.memberId}".`
        : `Admin account already exists with username "${result.username}" and member ID "${result.memberId}".`
    );
  } catch (error) {
    console.error('Admin seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
