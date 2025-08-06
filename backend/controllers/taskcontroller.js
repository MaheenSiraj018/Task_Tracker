const Task = require('../models/task');
const { asyncHandler } = require('../middlewares/error');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private

exports.getTasks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 5;
  const skip = (page - 1) * limit;

  const total = await Task.countDocuments({ userId: req.user.id });
  const totalPages = Math.ceil(total / limit);

  const tasks = await Task.find({ userId: req.user.id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    total,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
    data: tasks,
  });
});



// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
exports.getOverdueTasks = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Task.find({
    userId: req.user.id,
    dueDate: { $lt: today },
    status: { $ne: 'completed' },
  });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user.id;
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, error: 'Task not found' });

  }

  if (task.userId.toString() !== req.user.id) {
    return res.status(401).json({ success: false, error: 'Not authorized to update this task' });

  }

  if (req.body.status === 'completed' && task.dueDate > Date.now()) {
    return res.status(400).json({ success: false, error: 'Cannot mark task as completed before due date' });

  }
    console.log("Updating Task:", req.body);

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: task });
});