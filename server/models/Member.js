const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9()\-\s]{7,20}$/;
const URL_REGEX = /^https?:\/\/.+/i;

const ROLE_VALUES = ['Member', 'Admin', 'SuperAdmin'];
const SEGMENT_VALUES = ['Business', 'Salaried', 'Student'];
const GENDER_VALUES = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_VALUES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const trimString = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const stringField = {
  type: String,
  trim: true,
  default: undefined,
};

const emailField = {
  type: String,
  trim: true,
  lowercase: true,
  default: undefined,
  validate: {
    validator: (value) => !value || EMAIL_REGEX.test(value),
    message: 'Invalid email address',
  },
};

const phoneField = {
  type: String,
  trim: true,
  default: undefined,
  validate: {
    validator: (value) => !value || PHONE_REGEX.test(value),
    message: 'Invalid phone number',
  },
};

const urlField = {
  type: String,
  trim: true,
  default: undefined,
  validate: {
    validator: (value) => !value || URL_REGEX.test(value),
    message: 'Invalid URL',
  },
};

const childSchema = new mongoose.Schema(
  {
    name: stringField,
    dob: stringField,
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUP_VALUES,
      default: undefined,
    },
    gender: stringField,
  },
  { _id: false }
);

const spouseSchema = new mongoose.Schema(
  {
    name: stringField,
    dob: stringField,
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUP_VALUES,
      default: undefined,
    },
    phone: phoneField,
  },
  { _id: false }
);

const familySchema = new mongoose.Schema(
  {
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married'],
      default: 'Single',
    },
    anniversary: stringField,
    spouse: {
      type: spouseSchema,
      default: () => ({}),
    },
    children: {
      type: [childSchema],
      default: [],
    },
  },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    website: urlField,
    linkedin: urlField,
    instagram: urlField,
    facebook: urlField,
    twitter: urlField,
    youtube: urlField,
    pinterest: urlField,
    customLinks: {
      type: [{
        name: { type: String, trim: true },
        url: urlField
      }],
      default: []
    }
  },
  { _id: false }
);

const businessSchema = new mongoose.Schema(
  {
    name: stringField,
    address: stringField,
    email: emailField,
    contactNo: phoneField,
    website: urlField,
    mapLocation: urlField,
    visitingCardImage: stringField,
    portfolioImages: {
      type: [String],
      default: [],
    },
    institute: stringField,
    department: stringField,
    year: stringField,
    idNumber: stringField,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    about: stringField,
    dob: stringField,
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUP_VALUES,
      default: undefined,
    },
    phone: phoneField,
    email: emailField,
    address: stringField,
    city: stringField,
    state: stringField,
    pincode: stringField,
    profession: stringField,
    businessRole: stringField,
    profileImage: stringField,
    business: {
      type: businessSchema,
      default: () => ({}),
    },
    social: {
      type: socialSchema,
      default: () => ({}),
    },
    family: {
      type: familySchema,
      default: () => ({ maritalStatus: 'Single', children: [] }),
    },
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
      minlength: 3,
      maxlength: 64,
    },
    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      select: false,
    },
    isTempPassword: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      ...emailField,
      required: true,
      unique: true,
    },
    phone: {
      ...phoneField,
      required: true,
    },
    address: stringField,
    city: stringField,
    state: stringField,
    pincode: stringField,
    profession: stringField,
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: 'Member',
      index: true,
    },
    membershipCategory: {
      type: String,
      trim: true,
      default: 'Member',
    },
    memberContribution: stringField,
    memberSegment: {
      type: String,
      enum: SEGMENT_VALUES,
      default: undefined,
    },
    gender: {
      type: String,
      enum: GENDER_VALUES,
      default: undefined,
    },
    lastLogin: {
      type: Date,
      default: undefined,
    },
    zone: {
      type: String,
      trim: true,
      default: 'Zone XVIII',
    },
    loName: {
      type: String,
      trim: true,
      default: 'JCI Madurai Central',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    profile: {
      type: profileSchema,
      default: () => ({ family: { maritalStatus: 'Single', children: [] } }),
    },
    monthlyReports: [
      {
        month: { type: String, required: true }, // Format: "YYYY-MM"
        content: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

memberSchema.pre('validate', function syncMemberProfile() {
  this.name = trimString(this.name);
  this.email = trimString(this.email)?.toLowerCase();
  this.phone = trimString(this.phone);
  this.address = trimString(this.address);
  this.city = trimString(this.city);
  this.state = trimString(this.state);
  this.pincode = trimString(this.pincode);
  this.profession = trimString(this.profession);
  this.memberContribution = trimString(this.memberContribution);
  this.zone = trimString(this.zone) || 'Zone XVIII';
  this.loName = trimString(this.loName) || 'JCI Madurai Central';

  if (this.memberId) {
    this.memberId = this.memberId.trim().toUpperCase();
  }

  if (this.username) {
    this.username = this.username.trim().toLowerCase();
  } else if (this.memberId) {
    this.username = this.memberId.toLowerCase();
  }

  if (!this.profile) {
    this.profile = {};
  }

  this.profile.phone = trimString(this.profile.phone) || this.phone;
  this.profile.email = trimString(this.profile.email)?.toLowerCase() || this.email;
  this.profile.address = trimString(this.profile.address) || this.address;
  this.profile.city = trimString(this.profile.city) || this.city;
  this.profile.state = trimString(this.profile.state) || this.state;
  this.profile.pincode = trimString(this.profile.pincode) || this.pincode;
  this.profile.profession = trimString(this.profile.profession) || this.profession;
  this.profile.about = trimString(this.profile.about);
  this.profile.dob = trimString(this.profile.dob);
  this.profile.businessRole = trimString(this.profile.businessRole);
  this.profile.profileImage = trimString(this.profile.profileImage);

  if (this.profile.business) {
    this.profile.business.name = trimString(this.profile.business.name);
    this.profile.business.address = trimString(this.profile.business.address);
    this.profile.business.email = trimString(this.profile.business.email)?.toLowerCase();
    this.profile.business.contactNo = trimString(this.profile.business.contactNo);
    this.profile.business.website = trimString(this.profile.business.website);
    this.profile.business.mapLocation = trimString(this.profile.business.mapLocation);
    this.profile.business.visitingCardImage = trimString(this.profile.business.visitingCardImage);
    this.profile.business.portfolioImages = (this.profile.business.portfolioImages || []).filter(Boolean);
    this.profile.business.institute = trimString(this.profile.business.institute);
    this.profile.business.department = trimString(this.profile.business.department);
    this.profile.business.year = trimString(this.profile.business.year);
    this.profile.business.idNumber = trimString(this.profile.business.idNumber);
  }

  if (this.profile.social) {
    Object.keys(this.profile.social.toObject ? this.profile.social.toObject() : this.profile.social).forEach((key) => {
      if (key !== 'customLinks') {
        this.profile.social[key] = trimString(this.profile.social[key]);
      }
    });
    if (this.profile.social.customLinks) {
       this.profile.social.customLinks = this.profile.social.customLinks.filter(l => l.name && l.url).map(l => ({ name: trimString(l.name), url: trimString(l.url) }));
    }
  }

  if (this.profile.family) {
    this.profile.family.anniversary = trimString(this.profile.family.anniversary);

    if (this.profile.family.spouse) {
      this.profile.family.spouse.name = trimString(this.profile.family.spouse.name);
      this.profile.family.spouse.dob = trimString(this.profile.family.spouse.dob);
      this.profile.family.spouse.phone = trimString(this.profile.family.spouse.phone);
    }

    this.profile.family.children = (this.profile.family.children || [])
      .map((child) => ({
        name: trimString(child.name),
        dob: trimString(child.dob),
        bloodGroup: trimString(child.bloodGroup),
        gender: trimString(child.gender),
      }))
      .filter((child) => Object.values(child).some(Boolean));
  }

});

memberSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

memberSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Member', memberSchema);
