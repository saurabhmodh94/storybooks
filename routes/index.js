const express = require('express');
const router = express.Router();

// Index Route
router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard', (req, res) => {
  res.send('dashboard');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

module.exports = router;
