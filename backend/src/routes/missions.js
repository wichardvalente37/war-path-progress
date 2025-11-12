const express = require('express');
const router = express.Router();
const { getAllMissions, createMission, updateMission, deleteMission } = require('../controllers/missionController');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, getAllMissions);
router.post('/', authMiddleware, createMission);
router.put('/:id', authMiddleware, updateMission);
router.delete('/:id', authMiddleware, deleteMission);

module.exports = router;
