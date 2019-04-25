const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Index Route
app.get('/', (req, res) => {
  res.send('index');
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
