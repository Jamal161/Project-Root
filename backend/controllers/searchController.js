const Event = require('../models/Event');

exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const events = await Event.find({
      $text: { $search: query }
    }, {
      score: { $meta: 'textScore' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .populate('creator', 'username');
    
    res.json(events);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};