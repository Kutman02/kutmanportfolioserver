import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  items: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Skill', skillSchema);

