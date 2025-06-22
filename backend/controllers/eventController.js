const Event = require('../models/Event');
const Notification = require('../models/Notification');
const upload = require('../middleware/upload');

exports.createEvent = [
  upload.single('banner'),
  async (req, res) => {
    try {
      const { title, description, date, location } = req.body;
      
      const event = new Event({
        title,
        description,
        date,
        location,
        banner: req.file ? req.file.path : null,
        creator: req.user.id
      });

      await event.save();
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.updateEvent = [
  upload.single('banner'),
  async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      // Check ownership
      if (event.creator.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const { title, description, date, location } = req.body;
      
      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.location = location || event.location;
      if (req.file) event.banner = req.file.path;

      await event.save();
      res.json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Check ownership
    if (event.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'username')
      .populate('subscribers', 'username');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'username')
      .sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.subscribeToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const userId = req.user.id;
    const index = event.subscribers.indexOf(userId);
    
    if (index > -1) {
      // Unsubscribe
      event.subscribers.splice(index, 1);
      await event.save();
      return res.json({ message: 'Unsubscribed successfully' });
    }
    
    // Subscribe
    event.subscribers.push(userId);
    await event.save();
    
    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};