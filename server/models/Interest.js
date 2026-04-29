const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },       // district
    cityLocal: { type: String, trim: true },  // city
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    profession: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'converted', 'rejected'],
      default: 'pending',
    },
    notes: { type: String }, // Admin can add notes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interest', interestSchema);
