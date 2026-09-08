const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

exports.listUsers = async (_req, res, next) => {
  try { res.json({ users: await User.find().sort({ name: 1 }) }); } catch (error) { next(error); }
};

exports.listTasks = async (_req, res, next) => {
  try { res.json({ tasks: await Task.find().populate('creator', 'name email').populate('assignedUser', 'name email').sort({ createdAt: -1 }) }); } catch (error) { next(error); }
};

exports.assignTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.body.userId !== null) {
      if (!mongoose.Types.ObjectId.isValid(req.body.userId)) return res.status(400).json({ message: 'Invalid user ID' });
      const user = await User.findById(req.body.userId);
      if (!user || user.role !== 'user') return res.status(400).json({ message: 'Tasks can only be assigned to a normal user' });
    }
    task.assignedUser = req.body.userId;
    await task.save();
    res.json({ task: await Task.findById(task.id).populate('creator', 'name email').populate('assignedUser', 'name email') });
  } catch (error) { next(error); }
};
