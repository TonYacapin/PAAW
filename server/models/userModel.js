const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'regulatory', 'animalhealth', 'livestock', 'extensionworker'], // Define roles as needed
    default: 'user',
  },
  isActive: {
    type: Boolean,
    
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
