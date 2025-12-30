import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  profilePhoto: {
    type: String,
    required: true
  },
  profilePhotoAlt: {
    type: String,
    default: 'Profile photo'
  }
}, {
  timestamps: true
});

export default mongoose.model('Profile', profileSchema);

