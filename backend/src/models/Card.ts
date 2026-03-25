import mongoose from 'mongoose';

const CardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    elements: { type: Array, default: [] },
    background: { type: String },
    audioUrl: { type: String },
    globalEffect: { type: String },
  },
  { timestamps: true }
);

export const Card = mongoose.model('Card', CardSchema);
