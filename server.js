import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import itemsRoutes from './src/routes/items.js';
import { connectToDatabase } from './src/db/connect.js';

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use('/api/items', itemsRoutes);

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not configured. Set it in .env for local dev or in Render environment variables.');
    process.exit(1);
  }

  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`✅ Express API running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Startup failed:', error);
  process.exit(1);
});
