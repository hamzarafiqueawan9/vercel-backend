import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemsRoutes from './src/routes/items.js';
import { connectToDatabase } from './src/db/connect.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to connect to MongoDB Atlas for API requests
async function ensureDatabaseConnected(req, res, next) {
  if (!process.env.MONGODB_URI) {
    return res.status(500).json({ error: 'MONGODB_URI is not configured in the environment' });
  }

  try {
    await connectToDatabase();
    next();
  } catch (error) {
    next(error);
  }
}

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Root status route
app.get('/', (_req, res) => {
  res.send('Backend is running');
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/items', ensureDatabaseConnected, itemsRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Express API running on http://localhost:${PORT}`);
  });
}

export default app;
