import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  file: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  externalLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);

