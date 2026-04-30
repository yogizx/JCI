// Suppress harmless DEP0060 warning from transitive dependencies (express/cors internals)
const _origEmit = process.emit;
process.emit = function (name, data) {
  if (name === 'warning' && data && data.name === 'DeprecationWarning' && data.code === 'DEP0060') return false;
  return _origEmit.apply(process, arguments);
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
const path = require('path');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const Member = require('./models/Member');
const Interest = require('./models/Interest');
const SystemSetting = require('./models/SystemSetting');
const Event = require('./models/Event');
const { ensureAdminAccount } = require('./utils/adminBootstrap');
const { sendEmail } = require('./utils/email');
const {
  applyMemberPayload,
  buildMemberCredentialEmailHtml,
  escapeRegex,
  generateTempPassword,
  isStrongPassword,
  isValidEmail,
  isValidPhone,
  normalizeEmail,
  normalizePhone,
  normalizeString,
  sanitizeMemberPayload,
  serializeMember,
  validateMemberPayload,
} = require('./utils/memberUtils');

dns.setDefaultResultOrder('ipv4first');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const frontendDistPath = path.resolve(__dirname, '../dist');

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const SITE_URL = process.env.SITE_URL || 'http://localhost:5173';
const MEMBER_ID_PREFIX = normalizeString(process.env.MEMBER_ID_PREFIX) || 'JCI-MC';
const ADMIN_ROLES = ['Admin', 'SuperAdmin'];

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const registerFrontend = () => {
  const fs = require('fs');
  const frontendIndexPath = path.join(frontendDistPath, 'index.html');
  const adminIndexPath = path.join(frontendDistPath, 'admin', 'index.html');

  console.log(`[Static] NODE_ENV=${process.env.NODE_ENV}`);
  console.log(`[Static] Checking dist at: ${frontendDistPath}`);
  console.log(`[Static] dist/admin/index.html exists: ${fs.existsSync(adminIndexPath)}`);

  if (!fs.existsSync(frontendIndexPath)) {
    console.warn('[Static] dist/index.html NOT found - React app will not be served. Run npm run build first.');
    return;
  }

  console.log('[Static] dist/index.html found - serving React app.');
  app.use(express.static(frontendDistPath));
  app.use('/admin', (req, res) => {
    if (fs.existsSync(adminIndexPath)) {
      return res.sendFile(adminIndexPath);
    }
    return res.status(404).send('Admin app not built. Run: npm run build');
  });

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(frontendIndexPath);
  });
};

const parsePositiveInt = (value, fallback, max = 200) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
};

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'You do not have permission to access this resource.' });
  }
  next();
};

const createToken = (member) =>
  jwt.sign(
    {
      id: member._id,
      role: member.role,
      memberId: member.memberId,
      username: member.username,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

const buildInterestEmailHtml = (interest) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
    <div style="background: #00153D; color: #ffffff; padding: 24px;">
      <h2 style="margin: 0;">New Membership Interest</h2>
      <p style="margin: 6px 0 0; opacity: 0.75;">Submitted from the Join Us page</p>
    </div>
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; color: #64748b; width: 160px;">Full Name</td><td style="padding: 8px 0; font-weight: 700;">${interest.name}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0; font-weight: 700;">${interest.email}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Phone</td><td style="padding: 8px 0; font-weight: 700;">${interest.phone}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Profession</td><td style="padding: 8px 0; font-weight: 700;">${interest.profession || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Address</td><td style="padding: 8px 0; font-weight: 700;">${interest.address || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">District</td><td style="padding: 8px 0; font-weight: 700;">${interest.city || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">City</td><td style="padding: 8px 0; font-weight: 700;">${interest.cityLocal || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">State</td><td style="padding: 8px 0; font-weight: 700;">${interest.state || '-'}</td></tr>
        <tr><td style="padding: 8px 0; color: #64748b;">Pincode</td><td style="padding: 8px 0; font-weight: 700;">${interest.pincode || '-'}</td></tr>
      </table>
    </div>
  </div>
`;

const generateMemberId = async () => {
  const year = new Date().getFullYear();
  const regex = new RegExp(`^${escapeRegex(MEMBER_ID_PREFIX)}-${year}-`);
  const lastMember = await Member.findOne({ memberId: regex })
    .sort({ createdAt: -1 })
    .select('memberId');

  let sequence = 1;
  const lastSequence = lastMember?.memberId?.match(/(\d+)$/);
  if (lastSequence) {
    sequence = Number.parseInt(lastSequence[1], 10) + 1;
  }

  for (let offset = 0; offset < 50; offset += 1) {
    const candidate = `${MEMBER_ID_PREFIX}-${year}-${String(sequence + offset).padStart(4, '0')}`;
    const exists = await Member.exists({ memberId: candidate });
    if (!exists) {
      return candidate;
    }
  }

  return `${MEMBER_ID_PREFIX}-${year}-${Date.now().toString().slice(-6)}`;
};

const buildMemberSearchQuery = (search) => {
  const term = normalizeString(search);
  if (!term) return { role: 'Member' };

  const regex = new RegExp(escapeRegex(term), 'i');

  return {
    role: 'Member',
    $or: [
      { name: regex },
      { memberId: regex },
      { email: regex },
      { username: regex },
      { membershipCategory: regex },
      { memberContribution: regex },
      { memberSegment: regex },
    ],
  };
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const identifier = normalizeString(req.body.memberId);
    const password = normalizeString(req.body.password);

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/member ID and password are required.' });
    }

    console.log(`Login attempt for: ${identifier}`);

    const member = await Member.findOne({
      $or: [
        { memberId: identifier.toUpperCase() },
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
    }).select('+password');

    if (!member) {
      console.log('User not found.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('User found, checking password...');
    const passwordMatches = await member.comparePassword(password);
    if (!passwordMatches) {
      console.log('Password mismatch.');
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    console.log('Password matches, generating token...');
    
    // Update last login
    member.lastLogin = new Date();
    await member.save();

    const token = createToken(member);
    const serializedMember = serializeMember(member);

    console.log('Login successful.');
    return res.json({
      token,
      member: {
        id: serializedMember.id,
        memberId: serializedMember.memberId,
        username: serializedMember.username,
        name: serializedMember.name,
        role: serializedMember.role,
        membershipCategory: serializedMember.membershipCategory,
        isTempPassword: serializedMember.isTempPassword,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to process login right now.' });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member account not found.' });
    }

    return res.json({ member: serializeMember(member) });
  } catch (error) {
    console.error('Auth me error:', error);
    return res.status(500).json({ message: 'Unable to fetch account details.' });
  }
});

app.post('/api/auth/validate', async (req, res) => {
  try {
    const memberId = normalizeString(req.body.memberId).toUpperCase();
    if (!memberId) {
      return res.status(400).json({ valid: false, message: 'Member ID is required.' });
    }

    const member = await Member.findOne({ memberId }).select('name membershipCategory role');
    if (!member) {
      return res.status(404).json({ valid: false, message: 'Member not found.' });
    }

    return res.json({
      valid: true,
      member: {
        name: member.name,
        role: member.membershipCategory || member.role,
      },
    });
  } catch (error) {
    console.error('Validate member error:', error);
    return res.status(500).json({ message: 'Unable to validate member details.' });
  }
});

// Settings routes
app.get('/api/settings/:key', authenticate, async (req, res) => {
  try {
    const setting = await SystemSetting.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found.' });
    }
    return res.json({ value: setting.value });
  } catch (error) {
    console.error('Get setting error:', error);
    return res.status(500).json({ message: 'Unable to fetch setting.' });
  }
});

app.put('/api/admin/settings/:key', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await SystemSetting.findOneAndUpdate(
      { key: req.params.key },
      { value, updatedBy: req.user.id },
      { new: true, upsert: true }
    );
    return res.json({ message: 'Setting updated successfully.', value: setting.value });
  } catch (error) {
    console.error('Update setting error:', error);
    return res.status(500).json({ message: 'Unable to update setting.' });
  }
});

// Public routes
app.post('/api/interest/submit', async (req, res) => {
  try {
    const name = normalizeString(req.body.name);
    const email = normalizeEmail(req.body.email);
    const phone = normalizePhone(req.body.phone);

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: 'Enter a valid phone number.' });
    }

    const interest = await Interest.create({
      name,
      email,
      phone,
      address: normalizeString(req.body.address),
      city: normalizeString(req.body.city),
      cityLocal: normalizeString(req.body.cityLocal),
      state: normalizeString(req.body.state),
      pincode: normalizeString(req.body.pincode),
      profession: normalizeString(req.body.profession),
    });

    await sendEmail(
      process.env.ADMIN_EMAIL,
      `New Membership Interest: ${interest.name}`,
      buildInterestEmailHtml(interest)
    );

    return res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Interest submit error:', error);
    return res.status(500).json({ message: 'Unable to submit the application right now.' });
  }
});

// Admin routes
app.get('/api/admin/members', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const limit = parsePositiveInt(req.query.limit, 50);
    const query = buildMemberSearchQuery(req.query.search);

    const total = await Member.countDocuments(query);
    const members = await Member.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.json({
      members: members.map(serializeMember),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error('Get members error:', error);
    return res.status(500).json({ message: 'Unable to fetch members right now.' });
  }
});

app.post('/api/admin/members/create', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const payload = sanitizeMemberPayload(req.body);
    const errors = validateMemberPayload(payload, { requireCore: true });

    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    const existingEmail = await Member.exists({ email: payload.email });
    if (existingEmail) {
      return res.status(409).json({ message: 'A member with this email already exists.' });
    }

    const memberId = await generateMemberId();
    const tempPassword = generateTempPassword();

    const newMember = new Member({
      ...payload,
      memberId,
      username: memberId.toLowerCase(),
      password: tempPassword,
      role: 'Member',
      isTempPassword: true,
      membershipCategory: payload.membershipCategory || 'Member',
      profile: {
        ...(payload.profile || {}),
        phone: payload.profile?.phone || payload.phone,
        email: payload.profile?.email || payload.email,
        address: payload.profile?.address || payload.address,
        city: payload.profile?.city || payload.city,
        state: payload.profile?.state || payload.state,
        pincode: payload.profile?.pincode || payload.pincode,
        profession: payload.profile?.profession || payload.profession,
      },
    });

    await newMember.save();

    const emailSent = await sendEmail(
      newMember.email,
      'Welcome to JCI Madurai Central - Your Member Credentials',
      buildMemberCredentialEmailHtml({
        name: newMember.name,
        memberId: newMember.memberId,
        tempPassword,
        siteUrl: SITE_URL,
      })
    );

    return res.status(201).json({
      message: emailSent
        ? 'Member created successfully and credentials were emailed.'
        : 'Member created successfully, but credential email delivery is pending.',
      member: serializeMember(newMember),
      credentials: {
        username: newMember.memberId,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Create member error:', error);
    return res.status(500).json({ message: 'Unable to create the member right now.' });
  }
});

app.get('/api/admin/members/:id', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member || member.role !== 'Member') {
      return res.status(404).json({ message: 'Member not found.' });
    }

    return res.json({ member: serializeMember(member) });
  } catch (error) {
    console.error('Get member error:', error);
    return res.status(500).json({ message: 'Unable to fetch the member right now.' });
  }
});

app.put('/api/admin/members/:id', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member || member.role !== 'Member') {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const payload = sanitizeMemberPayload(req.body);
    const errors = validateMemberPayload(payload);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    if (payload.email && payload.email !== member.email) {
      const duplicateEmail = await Member.exists({ email: payload.email, _id: { $ne: member._id } });
      if (duplicateEmail) {
        return res.status(409).json({ message: 'Another member already uses this email address.' });
      }
    }

    applyMemberPayload(member, payload);
    await member.save();

    return res.json({
      message: 'Member updated successfully.',
      member: serializeMember(member),
    });
  } catch (error) {
    console.error('Update member error:', error);
    return res.status(500).json({ message: 'Unable to update the member right now.' });
  }
});

app.delete('/api/admin/members/:id', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'You cannot delete the currently signed-in admin account.' });
    }

    const member = await Member.findById(req.params.id);
    if (!member || member.role !== 'Member') {
      return res.status(404).json({ message: 'Member not found.' });
    }

    await member.deleteOne();

    return res.json({ message: 'Member deleted successfully.' });
  } catch (error) {
    console.error('Delete member error:', error);
    return res.status(500).json({ message: 'Unable to delete the member right now.' });
  }
});

app.get('/api/admin/interests', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const interests = await Interest.find().sort({ createdAt: -1 });
    return res.json({ interests });
  } catch (error) {
    console.error('Get interests error:', error);
    return res.status(500).json({ message: 'Unable to fetch interest submissions right now.' });
  }
});

app.get('/api/admin/stats', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalMembers, newThisMonth, totalEvents, activeMembers] = await Promise.all([
      Member.countDocuments({ role: 'Member' }),
      Member.countDocuments({ role: 'Member', createdAt: { $gte: startOfMonth } }),
      Event.countDocuments(),
      Member.countDocuments({ role: 'Member', isTempPassword: false }),
    ]);

    return res.json({ totalMembers, newThisMonth, totalEvents, activeMembers });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return res.status(500).json({ message: 'Unable to fetch dashboard statistics right now.' });
  }
});

app.get('/api/admin/login-logs', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const logs = await Member.find({ lastLogin: { $ne: null } })
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('name lastLogin memberId role');

    return res.json({ logs });
  } catch (error) {
    console.error('Get login logs error:', error);
    return res.status(500).json({ message: 'Unable to fetch login logs.' });
  }
});

app.get('/api/admin/analytics-complex', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const [categories, segments] = await Promise.all([
      Member.aggregate([
        { $match: { role: 'Member' } },
        { $group: { _id: '$membershipCategory', count: { $sum: 1 } } }
      ]),
      Member.aggregate([
        { $match: { role: 'Member' } },
        { $group: { _id: '$memberSegment', count: { $sum: 1 } } }
      ])
    ]);

    const COLORS = [
      'from-indigo-600 to-violet-500',
      'from-violet-600 to-purple-500',
      'from-fuchsia-500 to-pink-500',
      'from-slate-700 to-slate-800',
      'from-emerald-500 to-teal-500',
      'from-amber-400 to-orange-500'
    ];

    const categoryStats = categories.map((c, i) => ({
      name: c._id || 'Unknown',
      value: c.count,
      color: COLORS[i % COLORS.length]
    }));

    const preferredSegments = ['Business', 'Salaried', 'Student'];
    const segmentCounts = segments.reduce((accumulator, segment) => {
      const name = segment._id || 'Unknown';
      accumulator[name] = segment.count;
      return accumulator;
    }, {});

    const segmentStats = [
      ...preferredSegments.map((name, index) => ({
        name,
        value: segmentCounts[name] || 0,
        color: COLORS[(index + 2) % COLORS.length]
      })),
      ...Object.entries(segmentCounts)
        .filter(([name]) => name && !preferredSegments.includes(name))
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[(index + preferredSegments.length + 2) % COLORS.length]
        })),
    ];

    // Generate pseudo-dynamic engagement metrics based on user count
    const totalMembers = categories.reduce((sum, c) => sum + c.count, 0);
    const revenueLevel = Math.min(100, Math.max(40, Math.floor((totalMembers / 500) * 100)));
    const postsLevel = Math.min(100, Math.max(30, 50 + (totalMembers % 25)));
    const referralsLevel = Math.min(100, Math.max(20, 45 + (totalMembers % 35)));
    const upgradesLevel = Math.min(100, Math.max(10, 30 + (totalMembers % 15)));
    const loginsLevel = Math.min(100, Math.max(60, 80 + (totalMembers % 20)));
    
    const participationRate = Math.min(99, Math.floor((revenueLevel + postsLevel + loginsLevel) / 3));
    
    const engagement = {
      metrics: [revenueLevel, postsLevel, referralsLevel, upgradesLevel, loginsLevel],
      participationRate
    };

    // Add some revenue estimation (mocked but based on member count)
    const revenue = categoryStats.reduce((acc, curr) => acc + (curr.value * 1500), 0);

    return res.json({
      categoryStats,
      segmentStats,
      revenue,
      engagement
    });
  } catch (error) {
    console.error('Get complex analytics error:', error);
    return res.status(500).json({ message: 'Unable to fetch detailed analytics.' });
  }
});

// Member routes
app.get('/api/member/profile', authenticate, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member profile not found.' });
    }

    return res.json({ member: serializeMember(member) });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Unable to fetch the member profile.' });
  }
});

app.put('/api/member/profile', authenticate, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member profile not found.' });
    }

    const payload = sanitizeMemberPayload(req.body);
    delete payload.membershipCategory;
    delete payload.memberContribution;
    delete payload.memberSegment;
    delete payload.zone;
    delete payload.loName;

    const errors = validateMemberPayload(payload);
    if (errors.length > 0) {
      return res.status(400).json({ message: errors[0], errors });
    }

    if (payload.email && payload.email !== member.email) {
      const duplicateEmail = await Member.exists({ email: payload.email, _id: { $ne: member._id } });
      if (duplicateEmail) {
        return res.status(409).json({ message: 'Another member already uses this email address.' });
      }
    }

    applyMemberPayload(member, payload);
    await member.save();

    return res.json({
      message: 'Profile updated successfully.',
      member: serializeMember(member),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Unable to update the member profile.' });
  }
});

app.put('/api/member/password', authenticate, async (req, res) => {
  try {
    const currentPassword = normalizeString(req.body.currentPassword);
    const newPassword = normalizeString(req.body.newPassword);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters and include uppercase, lowercase, and a number.',
      });
    }

    const member = await Member.findById(req.user.id).select('+password');
    if (!member) {
      return res.status(404).json({ message: 'Member profile not found.' });
    }

    const passwordMatches = await member.comparePassword(currentPassword);
    if (!passwordMatches) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    const samePassword = await member.comparePassword(newPassword);
    if (samePassword) {
      return res.status(400).json({ message: 'New password must be different from the current password.' });
    }

    member.password = newPassword;
    member.isTempPassword = false;
    await member.save();

    await sendEmail(
      member.email,
      'Security Alert: Password Changed',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <div style="background: #00153D; color: #ffffff; padding: 24px;">
            <h2 style="margin: 0;">Security Alert</h2>
          </div>
          <div style="padding: 24px; color: #1f2937;">
            <p>Hello <strong>${member.name}</strong>,</p>
            <p>The password for your JCI Madurai Central account was recently changed.</p>
            <p>If you did not perform this action, please contact support immediately.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="font-size: 12px; color: #64748b;">This is an automated security notification.</p>
          </div>
        </div>
      `
    );

    return res.json({
      message: 'Password updated successfully.',
      member: serializeMember(member),
    });
  } catch (error) {
    console.error('Update password error:', error);
    return res.status(500).json({ message: 'Unable to update the password right now.' });
  }
});

app.get('/api/member/monthly-reports', authenticate, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id).select('monthlyReports');
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    return res.json({ reports: member.monthlyReports || [] });
  } catch (error) {
    console.error('Get monthly reports error:', error);
    return res.status(500).json({ message: 'Unable to fetch monthly reports.' });
  }
});

app.post('/api/member/monthly-reports', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required.' });
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const existingReport = member.monthlyReports.find(r => r.month === currentMonth);
    if (existingReport) {
      return res.status(400).json({ message: 'A report for this month has already been submitted and cannot be changed.' });
    }

    member.monthlyReports.push({
      month: currentMonth,
      content,
      submittedAt: now
    });

    await member.save();
    return res.status(201).json({ message: 'Monthly report submitted successfully.', report: member.monthlyReports[member.monthlyReports.length - 1] });
  } catch (error) {
    console.error('Submit monthly report error:', error);
    return res.status(500).json({ message: 'Unable to submit monthly report.' });
  }
});

// ─── Event routes ───────────────────────────────────────────────────────────

// Create event
app.post('/api/admin/events', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.eventName || !body.vertical || !body.date || !body.time) {
      return res.status(400).json({ message: 'eventName, vertical, date and time are required.' });
    }
    console.log('Creating event with body:', JSON.stringify(body, null, 2));
    const event = await Event.create({
      eventName:          (body.eventName || '').trim(),
      vertical:           (body.vertical || '').trim(),
      idType:             (body.idType || '').trim(),
      date:               body.date,
      time:               body.time,
      program:            (body.program || '').trim(),
      venue:              (body.venue || '').trim(),
      chiefGuest:         (body.chiefGuest || '').trim(),
      chiefGuestId:       (body.chiefGuestId || '').trim(),
      guestOfHonor:       (body.guestOfHonor || '').trim(),
      guestOfHonorId:     (body.guestOfHonorId || '').trim(),
      facultySpeaker:     (body.facultySpeaker || '').trim(),
      facultySpeakerId:   (body.facultySpeakerId || '').trim(),
      zoneNationalPerson: (body.zoneNationalPerson || '').trim(),
      eventOverview:      (body.eventOverview || '').trim(),
      banner:             body.banner || '',
      invitation:         body.invitation || '',
      eventGallery:       Array.isArray(body.eventGallery) ? body.eventGallery : [],
      secretaryName:      (body.secretaryName || '').trim(),
      secretarySignature: body.secretarySignature || '',
      secretaryPerson:    (body.secretaryPerson || 'Secretary').trim(),
      agendaItems:        Array.isArray(body.agendaItems) ? body.agendaItems : [],
      managementAgenda:   body.managementAgenda || {},
      isPublic:           Boolean(body.isPublic),
      createdBy:          req.user.id,
    });
    return res.status(201).json({ message: 'Event created successfully.', event });
  } catch (error) {
    console.error('Create event error:', error);
    return res.status(500).json({ message: 'Unable to create event.' });
  }
});

// List events (optional ?vertical= filter)
app.get('/api/admin/events', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const filter = {};
    if (req.query.vertical) filter.vertical = req.query.vertical;
    const events = await Event.find(filter).sort({ createdAt: -1 }).limit(200);
    return res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    return res.status(500).json({ message: 'Unable to fetch events.' });
  }
});

// Get vertical counts (for Analytics page)
app.get('/api/admin/events/vertical-counts', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    const agg = await Event.aggregate([
      { $group: { _id: '$vertical', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const counts = {};
    agg.forEach(item => { counts[item._id] = item.count; });
    return res.json({ counts });
  } catch (error) {
    console.error('Vertical counts error:', error);
    return res.status(500).json({ message: 'Unable to fetch vertical counts.' });
  }
});

// Publish/unpublish event in member portal
app.patch('/api/admin/events/:id/visibility', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { isPublic: Boolean(req.body.isPublic) } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    return res.json({
      message: event.isPublic
        ? 'Event is now visible in the member portal.'
        : 'Event is now hidden from the member portal.',
      event,
    });
  } catch (error) {
    console.error('Update event visibility error:', error);
    return res.status(500).json({ message: 'Unable to update event visibility.' });
  }
});

// Update event
app.put('/api/admin/events/:id', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const body = req.body || {};
    const set = {};
    const trimFields = [
      'eventName',
      'vertical',
      'idType',
      'program',
      'venue',
      'chiefGuest',
      'chiefGuestId',
      'guestOfHonor',
      'guestOfHonorId',
      'facultySpeaker',
      'facultySpeakerId',
      'zoneNationalPerson',
      'eventOverview',
      'secretaryName',
      'secretaryPerson',
    ];

    trimFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        set[field] = (body[field] || '').trim();
      }
    });

    [
      'date',
      'time',
      'banner',
      'invitation',
      'secretarySignature',
      'managementAgenda',
      'report',
    ].forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        set[field] = body[field];
      }
    });

    if (Object.prototype.hasOwnProperty.call(body, 'eventGallery')) {
      set.eventGallery = Array.isArray(body.eventGallery) ? body.eventGallery : [];
    }
    if (Object.prototype.hasOwnProperty.call(body, 'agendaItems')) {
      set.agendaItems = Array.isArray(body.agendaItems) ? body.agendaItems : [];
    }
    if (Object.prototype.hasOwnProperty.call(body, 'isPublic')) {
      set.isPublic = Boolean(body.isPublic);
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: set },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    return res.json({ message: 'Event updated successfully.', event });
  } catch (error) {
    console.error('Update event error:', error);
    return res.status(500).json({ message: 'Unable to update event.' });
  }
});

// Public events (for users)
app.get('/api/events', authenticate, async (req, res) => {
  try {
    const events = await Event.find({ isPublic: true }).sort({ date: 1, createdAt: -1 });
    return res.json({ events });
  } catch (error) {
    console.error('Get public events error:', error);
    return res.status(500).json({ message: 'Unable to fetch events.' });
  }
});

app.get('/api/events/:id', authenticate, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const event = await Event.findOne({ _id: req.params.id, isPublic: true });
    if (!event) return res.status(404).json({ message: 'Event not found or not public.' });
    return res.json({ event });
  } catch (error) {
    console.error('Get public event detail error:', error);
    return res.status(500).json({ message: 'Unable to fetch event details.' });
  }
});

// Delete event
app.delete('/api/admin/events/:id', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    return res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Delete event error:', error);
    return res.status(500).json({ message: 'Unable to delete event.' });
  }
});
// Save/update event report
app.put('/api/admin/events/:id/report', authenticate, authorize(...ADMIN_ROLES), async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { report: req.body.report || {} } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    return res.json({ message: 'Report saved.', event });
  } catch (error) {
    console.error('Save report error:', error);
    return res.status(500).json({ message: 'Unable to save report.' });
  }
});

// NOTE: Static frontend and catch-all routes are registered inside startServer()
// after all API routes, to ensure correct Express route ordering.

app.use('/api/*splat', (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} was not found.` });
});

async function startServer() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing.');
  }

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing.');
  }

  mongoose.set('strictQuery', true);
  mongoose.connection.on('connected', () => console.log('Mongoose: Connected to DB'));
  mongoose.connection.on('error', (err) => console.error('Mongoose: Connection error:', err));
  mongoose.connection.on('disconnected', () => console.log('Mongoose: Disconnected from DB'));

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
  });

  console.log('Connected to MongoDB successfully.');

  const adminBootstrap = await ensureAdminAccount();
  console.log(
    adminBootstrap.created
      ? `Admin account created in MongoDB with username "${adminBootstrap.username}".`
      : `Admin account ready in MongoDB with username "${adminBootstrap.username}".`
  );

  // Register frontend static files AFTER all API routes
  registerFrontend();

  // Seed default settings
  const welcomeKey = 'dashboard_welcome_message';
  const welcomeExists = await SystemSetting.exists({ key: welcomeKey });
  if (!welcomeExists) {
    await SystemSetting.create({
      key: welcomeKey,
      value: "You have 2 flagship events and 1 community project scheduled for this week. Your current participation score is in the top 5 percentile.",
      description: "Welcome message displayed on member dashboard banner"
    });
    console.log('Default dashboard welcome message seeded.');
  }

  const bannerKey = 'dashboard_banner_image';
  const bannerExists = await SystemSetting.exists({ key: bannerKey });
  if (!bannerExists) {
    await SystemSetting.create({
      key: bannerKey,
      value: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      description: "Background image for the dashboard welcome card"
    });
    console.log('Default dashboard banner image seeded.');
  }

  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}.`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
