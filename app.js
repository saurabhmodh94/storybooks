const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Load Models
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Keys
const keys = require('./config/keys');

// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Mongoose Connect
mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true // to get rid of warning
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Use Routes
app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
