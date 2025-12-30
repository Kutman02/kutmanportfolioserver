import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String
  }],
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  youtubeVideo: {
    type: String,
    default: ''
  },
  github: {
    type: String,
    default: ''
  },
  demo: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);

