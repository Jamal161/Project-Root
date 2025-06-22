const router = require('express').Router();
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
auth = require('../middleware/auth');

router.get('/check', auth(), async (req, res) => {
  const subs = await Subscription.find({ user: req.user.id }).select('event');
  const eventIds = subs.map(s => s.event);
  const notes = await Notification.find({ event: { $in: eventIds } });
  res.json(notes);
});

module.exports = router;