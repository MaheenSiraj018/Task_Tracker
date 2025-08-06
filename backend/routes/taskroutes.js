const express = require('express');
const {
  getTasks,
  getOverdueTasks,
  createTask,
  updateTask,
} = require('../controllers/taskcontroller');
const { protect } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/error');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(asyncHandler(getTasks))
  .post(asyncHandler(createTask));

router.get('/overdue', asyncHandler(getOverdueTasks));
router.patch('/:id', asyncHandler(updateTask));

module.exports = router;