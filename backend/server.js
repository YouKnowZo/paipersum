const dotenv = require('dotenv');
const express = require('express');
const { connectDB } = require('./config/db');

// 1. Load environment variables
dotenv.config({ path: './.env' });

// 2. Verify required variables
const requiredEnvVars = ['PORT', 'MONGODB_URI'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

const app = require('./app');
const PORT = process.env.PORT || 3001;

// Database connection
connectDB();

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});