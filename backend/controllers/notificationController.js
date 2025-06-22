const Notification = require('../models/Notification');
const Event = require('../models/Event');

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.checkForUpdates = async (req, res) => {
  try {
    // Find all events the user is subscribed to
    const events = await Event.find({ subscribers: req.user.id });
    
    const eventIds = events.map(event => event._id);
    
    // Find the last notification time for the user
    const lastNotification = await Notification.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    const lastCheckTime = lastNotification ? lastNotification.createdAt : new Date(0);
    
    // Find updates since last check
    const updatedEvents = await Event.find({
      _id: { $in: eventIds },
      updatedAt: { $gt: lastCheckTime }
    });
    
    // Create notifications
    const newNotifications = await Promise.all(
      updatedEvents.map(async event => {
        const notification = new Notification({
          user: req.user.id,
          event: event._id,
          message: `Event "${event.title}" has been updated`
        });
        return notification.save();
      })
    );
    
    res.json(newNotifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};