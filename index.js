import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ─── MongoDB Atlas Connection ─────────────────────────────────────
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME || 'my-app-db',
  });
  isConnected = true;
  console.log('✅ MongoDB Atlas connected');
}

connectDB().catch((err) => console.error('❌ MongoDB error:', err.message));

// ─── Item Model ───────────────────────────────────────────────────
const itemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    category: { type: String, required: true },
    value:    { type: Number, required: true },
    status:   { type: String, enum: ['active', 'pending', 'inactive'], default: 'active' },
    image:    { type: String, default: '' },
  },
  { timestamps: true }
);

const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

// ─── Routes ───────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send('Backend is running');
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET all items
app.get('/api/items', async (_req, res) => {
  try {
    await connectDB();
    const items = await Item.find({}).sort({ value: -1 }).lean();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST create item
app.post('/api/items', async (req, res) => {
  try {
    await connectDB();
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT update item
app.put('/api/items/:id', async (req, res) => {
  try {
    await connectDB();
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE item
app.delete('/api/items/:id', async (req, res) => {
  try {
    await connectDB();
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ─── Start Server (local only) ────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`server is running ${PORT}`);
  });
}

export default app;
