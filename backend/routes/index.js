const express = require('express');
const authRoutes = require('./authroutes');
const taskRoutes = require('./taskroutes');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/tasks', taskRoutes);

module.exports = router;