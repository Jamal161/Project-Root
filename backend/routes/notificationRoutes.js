const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getUserNotifications,
  checkForUpdates,
  markAsRead
} = require('../controllers/notificationController');

// Protected routes
router.get('/', auth, getUserNotifications);
router.post('/check', auth, checkForUpdates);
router.put('/:id/read', auth, markAsRead);

module.exports = router;