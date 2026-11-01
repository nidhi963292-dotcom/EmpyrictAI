const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const mlService = require('./services/mlService');

// Route files
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const aiInsightRoutes = require('./routes/aiInsightRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Connect to Database
connectDB();

// Security & Utility Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/ai-insights', aiInsightRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Serve static React build if present (e.g. monolithic or Docker production deployment)
const clientDistPath = path.join(__dirname, '../../client/dist');
const fs = require('fs');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/^(?!\/api).+/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Root welcome / status endpoint for API-only mode
  app.get('/', (req, res) => {
    res.status(200).json({
      message: '🌟 Empyrict-AI Backend API is active and healthy!',
      version: '1.0.0',
      documentation: {
        health: 'GET /api/health',
        auth: '/api/auth',
        employees: '/api/employees',
        predictions: '/api/predictions',
        aiInsights: '/api/ai-insights',
        dashboard: '/api/dashboard'
      },
      frontendAppUrl: process.env.CLIENT_URL || 'http://localhost:5173'
    });
  });
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const mlHealth = await mlService.checkHealth();
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    backend: 'Node.js/Express',
    database: 'MongoDB',
    mlService: mlHealth
  });
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Empyrict-AI Server] Running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`[Server Error] Unhandled Rejection: ${err.message}`);
});

module.exports = app;
