const router = require('express').Router();
const controller = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
router.use(auth, admin);
router.get('/users', controller.listUsers);
router.get('/tasks', controller.listTasks);
router.patch('/tasks/:id/assign', controller.assignTask);
module.exports = router;
