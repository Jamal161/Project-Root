const express = require('express');
const router = express.Router();
const { searchEvents } = require('../controllers/searchController');

// Public route
router.get('/', searchEvents);

module.exports = router;