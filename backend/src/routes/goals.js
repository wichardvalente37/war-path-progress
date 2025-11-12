const express = require('express');
const router = express.Router();
const { getAllGoals, createGoal, updateGoal, deleteGoal } = require('../controllers/goalController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, getAllGoals);
router.post('/', authMiddleware, createGoal);
router.put('/:id', authMiddleware, updateGoal);
router.delete('/:id', authMiddleware, deleteGoal);

module.exports = router;
