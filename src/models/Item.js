import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    value:    { type: Number, required: true },
    status:   { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
    image:    { type: String, default: '' },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError in serverless (hot-reload)
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default Item;
