require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MPESA endpoints
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body;
    
    // TODO: Implement STK push logic here
    // This is where you'll integrate with the MPESA API
    
    res.json({
      success: true,
      message: 'STK push initiated',
      data: { amount, phoneNumber }
    });
  } catch (error) {
    console.error('STK push error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate STK push',
      error: error.message
    });
  }
});

app.post('/api/mpesa/callback', (req, res) => {
  try {
    console.log('MPESA callback received:', req.body);
    // TODO: Handle MPESA callback
    // This is where you'll process the MPESA payment confirmation
    
    res.json({ success: true });
  } catch (error) {
    console.error('Callback processing error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 