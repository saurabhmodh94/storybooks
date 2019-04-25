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

// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

// Process Add Story
router.post('/', (req, res) => {
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

module.exports = router;
