import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sosRoutes from './routes/sosRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Malformed JSON Request Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: "MALFORMED_JSON",
      message: "Invalid JSON payload structure received."
    });
  }
  next();
});

app.use(sosRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'KavachLink-Backend' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CS2 Backend] Server running on port ${PORT}`);
});