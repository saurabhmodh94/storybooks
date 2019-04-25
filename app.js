const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();

// Load Models
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Keys
const keys = require('./config/keys');

// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true // to get rid of warning
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Load Routes
const auth = require('./routes/auth');

// Index Route
app.get('/', (req, res) => {
  res.send('index');
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
