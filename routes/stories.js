const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

const Story = mongoose.model('stories');

// Stories Index
router.get('/', (req, res) => {
  Story.find({ status: 'public' })
    .populate('user') // tip: prefetch_related
    .sort({ date: 'desc' })
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

// List stories from a user
router.get('/user/:userId', (req, res) => {
  Story.find({ user: req.params.userId, status: 'public' })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

// Logged in users stories
router.get('/my', ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .populate('user')
    .then(stories => {
      res.render('stories/index', {
        stories: stories
      });
    });
});

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Show Single Story
router.get('/show/:id', (req, res) => {
  Story.findOne({
    _id: req.params.id
  })
    .populate('user')
    .populate('comments.commentUser')
    .then(story => {
      if (
        story.status == 'public' ||
        (req.user && req.user.id == story.user._id)
      ) {
        res.render('stories/show', {
          story: story
        });
      } else {
        res.redirect('/stories');
      }
    });
});

// Edit Story Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story: story
      });
    }
  });
});

// Process Add Story
router.post('/', ensureAuthenticated, (req, res) => {
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: req.body.allowComments ? true : false, // tip
    user: req.user.id
  };

  // Create Story
  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// Edit Form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = req.body.allowComments ? true : false;

    story.save().then(story => {
      res.redirect('/dashboard');
    });
  });
});

// Delete Story
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Story.deleteOne({ _id: req.params.id }).then(() => {
    res.redirect('/dashboard');
  });
});

// Add Comment
router.post('/comment/:id', ensureAuthenticated, (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add to comments array
    story.comments.unshift(newComment); // tip

    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
