const express = require('express');
const { register, login } = require('../controllers/authcontroller');
const { asyncHandler } = require('../middlewares/error');

const router = express.Router();

router.post('/signup', asyncHandler(register));
router.post('/login', asyncHandler(login));

module.exports = router;