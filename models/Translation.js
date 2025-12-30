import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['en', 'ru']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Translation', translationSchema);

