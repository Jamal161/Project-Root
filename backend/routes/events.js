const router = require('express').Router();
const Event = require('../models/Event');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', auth('admin'), upload.single('banner'), async (req, res) => {
  const event = new Event({ ...req.body, banner: req.file.path, createdBy: req.user.id });
  await event.save();
  res.status(201).json(event);
});

router.get('/', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const events = await Event.find({ title: { $regex: q, $options: 'i' } });
  res.json(events);
});

router.put('/:id', auth('admin'), async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await Notification.create({ event: event._id, message: `Event '${event.title}' updated.` });
  res.json(event);
});

router.delete('/:id', auth('admin'), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

router.post('/:id/subscribe', auth(), async (req, res) => {
  await Subscription.create({ user: req.user.id, event: req.params.id });
  res.sendStatus(200);
});

router.post('/:id/unsubscribe', auth(), async (req, res) => {
  await Subscription.deleteOne({ user: req.user.id, event: req.params.id });
  res.sendStatus(200);
});