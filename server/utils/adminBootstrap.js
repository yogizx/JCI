const Member = require('../models/Member');

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : '');

async function ensureAdminAccount() {
  const username = (normalizeString(process.env.ADMIN_LOGIN_USERNAME) || 'admin').toLowerCase();
  const password = normalizeString(process.env.ADMIN_LOGIN_PASSWORD) || 'admin';
  const memberId = (normalizeString(process.env.ADMIN_LOGIN_MEMBER_ID) || 'ADMIN-001').toUpperCase();
  const name = normalizeString(process.env.ADMIN_LOGIN_NAME) || 'Admin';
  const email = (normalizeString(process.env.ADMIN_LOGIN_EMAIL) || 'admin@jcimaduraicentral.com').toLowerCase();
  const phone = normalizeString(process.env.ADMIN_LOGIN_PHONE) || '0000000000';

  let admin = await Member.findOne({
    $or: [{ username }, { memberId }, { email }],
  }).select('+password');

  if (!admin) {
    admin = new Member({
      username,
      memberId,
      password,
      name,
      email,
      phone,
      role: 'Admin',
      isTempPassword: false,
      membershipCategory: 'Admin',
      zone: process.env.DEFAULT_ZONE || 'Zone XVIII',
      loName: process.env.DEFAULT_LO_NAME || 'JCI Madurai Central',
      profile: {
        phone,
        email,
      },
    });

    await admin.save();

    return {
      created: true,
      username,
      memberId,
    };
  }

  let changed = false;

  if (!admin.username) {
    admin.username = username;
    changed = true;
  }

  if (admin.role !== 'Admin' && admin.role !== 'SuperAdmin') {
    admin.role = 'Admin';
    changed = true;
  }

  if (!admin.membershipCategory) {
    admin.membershipCategory = 'Admin';
    changed = true;
  }

  if (!admin.name) {
    admin.name = name;
    changed = true;
  }

  if (!admin.email) {
    admin.email = email;
    changed = true;
  }

  if (!admin.phone) {
    admin.phone = phone;
    changed = true;
  }

  if (!admin.profile) {
    admin.profile = { phone, email };
    changed = true;
  }

  const passwordMatches = await admin.comparePassword(password);
  if (!passwordMatches) {
    admin.password = password;
    admin.isTempPassword = false;
    changed = true;
  }

  if (changed) {
    await admin.save();
  }

  return {
    created: false,
    username: admin.username,
    memberId: admin.memberId,
  };
}

module.exports = { ensureAdminAccount };
