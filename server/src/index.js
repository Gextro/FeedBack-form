import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

// route imports (to be implemented)
import authRoutes from './routes/auth.routes.js';
import formRoutes from './routes/form.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (_req, res) => {
  res.send({ message: 'Feedback Collection Platform API' });
});

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
