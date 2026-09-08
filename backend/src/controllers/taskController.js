const mongoose = require('mongoose');
const Task = require('../models/Task');

const statuses = ['todo', 'doing', 'done'];
const populate = (query) => query.populate('creator', 'name email').populate('assignedUser', 'name email');
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
const canManage = (task, user) => user.role === 'admin' || task.creator.equals(user.id) || task.assignedUser?.equals(user.id);

exports.listTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { $or: [{ creator: req.user.id }, { assignedUser: req.user.id }, { assignedUser: null }] };
    res.json({ tasks: await populate(Task.find(filter).sort({ createdAt: -1 })) });
  } catch (error) { next(error); }
};

exports.createTask = async (req, res, next) => {
  try {
    const title = req.body.title?.trim();
    if (!title) return res.status(400).json({ message: 'Task title is required' });
    const status = req.body.status || 'todo';
    if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid task status' });
    const task = await Task.create({ title, description: req.body.description?.trim() || '', status, creator: req.user.id });
    res.status(201).json({ task: await populate(Task.findById(task.id)) });
  } catch (error) { next(error); }
};

exports.updateTask = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canManage(task, req.user)) return res.status(403).json({ message: 'You cannot edit this task' });
    if ('title' in req.body) {
      if (!req.body.title?.trim()) return res.status(400).json({ message: 'Task title is required' });
      task.title = req.body.title.trim();
    }
    if ('description' in req.body) task.description = req.body.description?.trim() || '';
    await task.save();
    res.json({ task: await populate(Task.findById(task.id)) });
  } catch (error) { next(error); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canManage(task, req.user)) return res.status(403).json({ message: 'You cannot delete this task' });
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    if (!validId(req.params.id) || !statuses.includes(req.body.status)) return res.status(400).json({ message: 'Valid task ID and status are required' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!canManage(task, req.user)) return res.status(403).json({ message: 'Assign the task to yourself before moving it' });
    task.status = req.body.status;
    await task.save();
    res.json({ task: await populate(Task.findById(task.id)) });
  } catch (error) { next(error); }
};

exports.assignSelf = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID' });
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.assignedUser) return res.status(409).json({ message: 'Task is already assigned' });
    task.assignedUser = req.user.id;
    await task.save();
    res.json({ task: await populate(Task.findById(task.id)) });
  } catch (error) { next(error); }
};
