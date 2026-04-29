const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    eventName:          { type: String, required: true, trim: true },
    vertical:           { type: String, required: true, trim: true },
    idType:             { type: String, trim: true, default: '' },
    date:               { type: String, required: true },
    time:               { type: String, required: true },
    program:            { type: String, trim: true, default: '' },
    venue:              { type: String, trim: true, default: '' },
    chiefGuest:         { type: String, trim: true, default: '' },
    chiefGuestId:       { type: String, trim: true, default: '' },
    guestOfHonor:       { type: String, trim: true, default: '' },
    guestOfHonorId:     { type: String, trim: true, default: '' },
    facultySpeaker:     { type: String, trim: true, default: '' },
    facultySpeakerId:   { type: String, trim: true, default: '' },
    zoneNationalPerson: { type: String, trim: true, default: '' },
    eventOverview:      { type: String, trim: true, default: '' },
    banner:             { type: String, default: '' },   // base64 or URL
    invitation:         { type: String, default: '' },  // base64 or URL
    eventGallery:       [{ type: String }],              // array of base64/URLs
    secretaryName:      { type: String, trim: true, default: '' },
    secretarySignature: { type: String, default: '' },
    secretaryPerson:    { type: String, trim: true, default: 'Secretary' },
    agendaItems:        [{ type: String }],
    managementAgenda:   { type: mongoose.Schema.Types.Mixed, default: {} },
    report:             { type: mongoose.Schema.Types.Mixed, default: null },
    isPublic:           { type: Boolean, default: false },
    createdBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', EventSchema);
