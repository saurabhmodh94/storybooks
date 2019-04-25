const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Load Models
require('./models/User');
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride('_method'));

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

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

// Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      truncate,
      stripTags,
      formatDate,
      select,
      editIcon
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
