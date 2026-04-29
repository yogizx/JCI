const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9()\-\s]{7,20}$/;
const URL_REGEX = /^(https?:\/\/)?[\w.-]+/i;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const MEMBER_SEGMENTS = ['Business', 'Salaried', 'Student'];
const GENDER_VALUES = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_VALUES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value || {}, key);

const normalizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const normalizeEmail = (value) => normalizeString(value).toLowerCase();

const normalizePhone = (value) => normalizeString(value).replace(/\s+/g, ' ');

const normalizeOptionalString = (value) => {
  const normalized = normalizeString(value);
  return normalized || '';
};

const normalizeEnum = (value, allowedValues) => {
  const normalized = normalizeString(value);
  return allowedValues.includes(normalized) ? normalized : '';
};

const isValidEmail = (value) => !value || EMAIL_REGEX.test(value);
const isValidPhone = (value) => !value || PHONE_REGEX.test(value);
const isValidUrl = (value) => !value || URL_REGEX.test(value);
const isStrongPassword = (value) => STRONG_PASSWORD_REGEX.test(normalizeString(value));

const readString = (source, key) => (hasOwn(source, key) ? normalizeOptionalString(source[key]) : undefined);
const readEmail = (source, key) => (hasOwn(source, key) ? normalizeEmail(source[key]) : undefined);
const readPhone = (source, key) => (hasOwn(source, key) ? normalizePhone(source[key]) : undefined);
const readEnum = (source, key, values) => (hasOwn(source, key) ? normalizeEnum(source[key], values) : undefined);

const sanitizeSocial = (source = {}) => {
  const social = {};
  ['website', 'linkedin', 'instagram', 'facebook', 'twitter', 'youtube', 'pinterest'].forEach((key) => {
    const value = readString(source, key);
    if (value !== undefined) {
      social[key] = value;
    }
  });
  return social;
};

const sanitizeBusiness = (source = {}) => {
  const business = {};

  ['name', 'address', 'visitingCardImage'].forEach((key) => {
    const value = readString(source, key);
    if (value !== undefined) {
      business[key] = value;
    }
  });

  const email = readEmail(source, 'email');
  if (email !== undefined) {
    business.email = email;
  }

  const contactNo = readPhone(source, 'contactNo');
  if (contactNo !== undefined) {
    business.contactNo = contactNo;
  }

  ['website', 'mapLocation', 'institute', 'department', 'year', 'idNumber'].forEach((key) => {
    const value = readString(source, key);
    if (value !== undefined) {
      business[key] = value;
    }
  });

  const gallery = hasOwn(source, 'portfolioImages') ? source.portfolioImages : source.businessGallery;
  if (Array.isArray(gallery)) {
    business.portfolioImages = gallery.map(normalizeOptionalString).filter(Boolean);
  }

  return business;
};

const sanitizeFamily = (source = {}) => {
  const family = {};

  const maritalStatus = readEnum(source, 'maritalStatus', ['Single', 'Married']);
  if (maritalStatus !== undefined) {
    family.maritalStatus = maritalStatus || 'Single';
  }

  const anniversary = readString(source, 'anniversary');
  if (anniversary !== undefined) {
    family.anniversary = anniversary;
  }

  if (hasOwn(source, 'spouse') && source.spouse && typeof source.spouse === 'object') {
    const spouse = {};

    ['name', 'dob'].forEach((key) => {
      const value = readString(source.spouse, key);
      if (value !== undefined) {
        spouse[key] = value;
      }
    });

    const bloodGroup = readEnum(source.spouse, 'bloodGroup', BLOOD_GROUP_VALUES);
    if (bloodGroup !== undefined) {
      spouse.bloodGroup = bloodGroup;
    }

    const phone = readPhone(source.spouse, 'phone');
    if (phone !== undefined) {
      spouse.phone = phone;
    }

    family.spouse = spouse;
  }

  if (hasOwn(source, 'children') && Array.isArray(source.children)) {
    family.children = source.children
      .map((child) => ({
        name: normalizeOptionalString(child?.name),
        dob: normalizeOptionalString(child?.dob),
        bloodGroup: normalizeEnum(child?.bloodGroup, BLOOD_GROUP_VALUES),
        gender: normalizeOptionalString(child?.gender),
      }))
      .filter((child) => Object.values(child).some(Boolean));
  }

  return family;
};

const sanitizeProfile = (source = {}) => {
  const profile = {};

  ['about', 'dob', 'address', 'city', 'state', 'pincode', 'profession', 'businessRole', 'profileImage'].forEach((key) => {
    const value = readString(source, key);
    if (value !== undefined) {
      profile[key] = value;
    }
  });

  const email = readEmail(source, 'email');
  if (email !== undefined) {
    profile.email = email;
  }

  const phone = readPhone(source, 'phone');
  if (phone !== undefined) {
    profile.phone = phone;
  }

  const bloodGroup = readEnum(source, 'bloodGroup', BLOOD_GROUP_VALUES);
  if (bloodGroup !== undefined) {
    profile.bloodGroup = bloodGroup;
  }

  const businessSource = source.business || {};
  if (hasOwn(source, 'business') || hasOwn(source, 'businessGallery')) {
    profile.business = sanitizeBusiness({
      ...businessSource,
      businessGallery: source.businessGallery,
    });
  }

  const socialSource = source.social || source.socialLinks || {};
  if (hasOwn(source, 'social') || hasOwn(source, 'socialLinks')) {
    profile.social = sanitizeSocial(socialSource);
  }

  if (hasOwn(source, 'family') && source.family && typeof source.family === 'object') {
    profile.family = sanitizeFamily(source.family);
  }

  return profile;
};

const sanitizeMemberPayload = (source = {}) => {
  const payload = {};

  ['name', 'address', 'city', 'state', 'pincode', 'profession', 'membershipCategory', 'memberContribution', 'zone', 'loName'].forEach((key) => {
    const value = readString(source, key);
    if (value !== undefined) {
      payload[key] = value;
    }
  });

  const email = readEmail(source, 'email');
  if (email !== undefined) {
    payload.email = email;
  }

  const phone = readPhone(source, 'phone');
  if (phone !== undefined) {
    payload.phone = phone;
  }

  const memberSegment = readEnum(source, 'memberSegment', MEMBER_SEGMENTS);
  if (memberSegment !== undefined) {
    payload.memberSegment = memberSegment;
  }

  const gender = readEnum(source, 'gender', GENDER_VALUES);
  if (gender !== undefined) {
    payload.gender = gender;
  }

  if (hasOwn(source, 'profile') && source.profile && typeof source.profile === 'object') {
    payload.profile = sanitizeProfile(source.profile);
  }

  return payload;
};

const validateMemberPayload = (payload, { requireCore = false } = {}) => {
  const errors = [];

  if (requireCore) {
    if (!payload.name) errors.push('Name is required.');
    if (!payload.email) errors.push('Email is required.');
    if (!payload.phone) errors.push('Phone number is required.');
    if (!payload.membershipCategory) errors.push('Membership Category is required.');
    if (!payload.memberContribution) errors.push('JCI Contribution is required.');
  }

  if (payload.email && !isValidEmail(payload.email)) {
    errors.push('Enter a valid email address.');
  }

  if (payload.phone && !isValidPhone(payload.phone)) {
    errors.push('Enter a valid phone number.');
  }

  if (payload.memberSegment && !MEMBER_SEGMENTS.includes(payload.memberSegment)) {
    errors.push('Invalid member segment.');
  }

  if (payload.gender && !GENDER_VALUES.includes(payload.gender)) {
    errors.push('Invalid gender value.');
  }

  if (payload.profile?.email && !isValidEmail(payload.profile.email)) {
    errors.push('Profile email is invalid.');
  }

  if (payload.profile?.phone && !isValidPhone(payload.profile.phone)) {
    errors.push('Profile phone number is invalid.');
  }

  if (payload.profile?.business?.email && !isValidEmail(payload.profile.business.email)) {
    errors.push('Business email is invalid.');
  }

  if (payload.profile?.business?.contactNo && !isValidPhone(payload.profile.business.contactNo)) {
    errors.push('Business contact number is invalid.');
  }

  const urlValues = [
    payload.profile?.business?.website,
    payload.profile?.business?.mapLocation,
    payload.profile?.social?.website,
    payload.profile?.social?.linkedin,
    payload.profile?.social?.instagram,
    payload.profile?.social?.facebook,
    payload.profile?.social?.twitter,
    payload.profile?.social?.youtube,
    payload.profile?.social?.pinterest,
  ].filter(Boolean);

  if (urlValues.some((url) => !isValidUrl(url))) {
    errors.push('One or more URLs are invalid.');
  }

  return errors;
};

const applyMemberPayload = (member, payload, { allowRoleChange = false } = {}) => {
  [
    'name',
    'email',
    'phone',
    'address',
    'city',
    'state',
    'pincode',
    'profession',
    'membershipCategory',
    'memberContribution',
    'memberSegment',
    'gender',
    'zone',
    'loName',
  ].forEach((key) => {
    if (payload[key] !== undefined) {
      member[key] = payload[key];
    }
  });

  if (allowRoleChange && payload.role) {
    member.role = payload.role;
  }

  if (!payload.profile) {
    return member;
  }

  const currentProfile = member.profile?.toObject ? member.profile.toObject() : member.profile || {};
  const nextProfile = {
    ...currentProfile,
    ...payload.profile,
  };

  if (payload.profile.business) {
    nextProfile.business = {
      ...(currentProfile.business || {}),
      ...payload.profile.business,
    };
  }

  if (payload.profile.social) {
    nextProfile.social = {
      ...(currentProfile.social || {}),
      ...payload.profile.social,
    };
  }

  if (payload.profile.family) {
    nextProfile.family = {
      ...(currentProfile.family || {}),
      ...payload.profile.family,
    };

    if (payload.profile.family.spouse) {
      nextProfile.family.spouse = {
        ...(currentProfile.family?.spouse || {}),
        ...payload.profile.family.spouse,
      };
    }

    if (Array.isArray(payload.profile.family.children)) {
      nextProfile.family.children = payload.profile.family.children;
    }
  }

  member.profile = nextProfile;
  return member;
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const serializeMember = (member) => {
  const data = member?.toObject ? member.toObject() : { ...member };

  delete data.password;
  delete data.__v;

  data.id = data._id?.toString() || data.id;

  if (!data.profile) {
    data.profile = {};
  }

  data.profile.phone = data.profile.phone || data.phone || '';
  data.profile.email = data.profile.email || data.email || '';
  data.profile.address = data.profile.address || data.address || '';
  data.profile.city = data.profile.city || data.city || '';
  data.profile.state = data.profile.state || data.state || '';
  data.profile.pincode = data.profile.pincode || data.pincode || '';
  data.profile.profession = data.profile.profession || data.profession || '';
  data.profile.memberId = data.memberId;
  data.profile.business = data.profile.business || {};
  data.profile.businessGallery = data.profile.businessGallery || data.profile.business.portfolioImages || [];
  data.profile.businessName = data.profile.businessName || data.profile.business.name || '';
  data.profile.socialLinks = {
    ...(data.profile.social || {}),
  };
  data.tags = [data.membershipCategory, data.memberSegment].filter(Boolean);

  return data;
};

const generateTempPassword = (length = 12) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const buildMemberCredentialEmailHtml = ({ name, memberId, tempPassword, siteUrl }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
    <div style="background: #00153D; color: #ffffff; padding: 28px 24px;">
      <h1 style="margin: 0; font-size: 24px;">Welcome to JCI Madurai Central</h1>
      <p style="margin: 8px 0 0; opacity: 0.8;">Your membership account has been created.</p>
    </div>
    <div style="padding: 28px 24px; color: #1f2937;">
      <p style="margin: 0 0 16px;">Hello <strong>${name}</strong>,</p>
      <p style="margin: 0 0 20px; line-height: 1.6;">
        Your member portal is ready. Use the credentials below to sign in. Your username is your membership ID.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;">Username</p>
        <p style="margin: 0 0 18px; font-size: 22px; font-weight: 700; color: #00153D;">${memberId}</p>
        <p style="margin: 0 0 8px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em;">Temporary Password</p>
        <p style="margin: 0; font-size: 22px; font-weight: 700; color: #A0813D; font-family: Consolas, monospace;">${tempPassword}</p>
      </div>
      <div style="background: #fff7ed; border: 1px solid #fdba74; color: #9a3412; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
        Change your temporary password immediately after your first login.
      </div>
      <a href="${siteUrl}/login" style="display: inline-block; background: #00153D; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 10px; font-weight: 700;">
        Open Member Portal
      </a>
    </div>
  </div>
`;

module.exports = {
  BLOOD_GROUP_VALUES,
  escapeRegex,
  applyMemberPayload,
  buildMemberCredentialEmailHtml,
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
};
