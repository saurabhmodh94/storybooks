const express = require('express');
const router = express.Router();

// Index Route
router.get('/', (req, res) => {
  res.send('index');
});

router.get('/dashboard', (req, res) => {
  res.send('dashboard');
});

module.exports = router;
