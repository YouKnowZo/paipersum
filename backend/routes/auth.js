const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Dummy users - replace with database in production
const users = [
  { id: 1, username: 'admin', password: 'password' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => 
    u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ 
      success: false,
      error: 'Invalid credentials' 
    });
  }

  const token = jwt.sign(
    { user: { id: user.id } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ 
    success: true,
    token 
  });
});

router.post('/logout', (req, res) => {
  // In a real app, you would invalidate the token
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

module.exports = router;