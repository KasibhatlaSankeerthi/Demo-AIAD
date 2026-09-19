const express = require('express');
const { getHealth } = require('../controllers/healthController');
const authRoutes = require('./auth');

const router = express.Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);

module.exports = router;
