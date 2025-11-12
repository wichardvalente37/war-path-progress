const express = require('express');
const router = express.Router();
const { getAllAchievements, createAchievement, deleteAchievement } = require('../controllers/achievementController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, getAllAchievements);
router.post('/', authMiddleware, createAchievement);
router.delete('/:id', authMiddleware, deleteAchievement);

module.exports = router;
