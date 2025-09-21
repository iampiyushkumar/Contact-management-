const mongoose = require('mongoose');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const phoneRegex = /^\+?\d{10}$/;

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
    trim: true,
    minlength: [2, 'Name too short'],
  },
  email: {
    type: String,
    required: [true, 'Email required'],
    trim: true,
    lowercase: true,
    unique: true,
    match: [emailRegex, 'Invalid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone required'],
    trim: true,
    match: [phoneRegex, 'Invalid phone'],
  },
}, { timestamps: true });


module.exports = mongoose.model('Contact', ContactSchema);