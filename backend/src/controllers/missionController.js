const pool = require('../config/database');

const getAllMissions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM missions WHERE user_id = $1 ORDER BY due_date ASC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createMission = async (req, res) => {
  const { title, description, difficulty, xp, status, due_date, goal_id, is_recurring, recurrence_pattern } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO missions (user_id, title, description, difficulty, xp, status, due_date, goal_id, is_recurring, recurrence_pattern) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [req.userId, title, description, difficulty, xp, status || 'pending', due_date, goal_id, is_recurring || false, recurrence_pattern]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMission = async (req, res) => {
  const { id } = req.params;
  const { title, description, difficulty, xp, status, due_date, goal_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE missions SET title = COALESCE($1, title), description = COALESCE($2, description), difficulty = COALESCE($3, difficulty), xp = COALESCE($4, xp), status = COALESCE($5, status), due_date = COALESCE($6, due_date), goal_id = $7, updated_at = NOW() WHERE id = $8 AND user_id = $9 RETURNING *',
      [title, description, difficulty, xp, status, due_date, goal_id, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // If mission completed, update XP and level
    if (status === 'completed') {
      const profileResult = await pool.query(
        'SELECT xp, level FROM profiles WHERE id = $1',
        [req.userId]
      );

      if (profileResult.rows.length > 0) {
        const profile = profileResult.rows[0];
        const newXP = (profile.xp || 0) + xp;
        const newLevel = Math.floor(newXP / 100) + 1;

        await pool.query(
          'UPDATE profiles SET xp = $1, level = $2 WHERE id = $3',
          [newXP, newLevel, req.userId]
        );
      }

      // Update goal progress if mission linked to goal
      if (goal_id) {
        const goalResult = await pool.query(
          'SELECT current, target FROM goals WHERE id = $1',
          [goal_id]
        );

        if (goalResult.rows.length > 0) {
          const goal = goalResult.rows[0];
          if (goal.current < goal.target) {
            await pool.query(
              'UPDATE goals SET current = current + 1 WHERE id = $1',
              [goal_id]
            );
          }
        }
      }
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update mission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMission = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM missions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    res.json({ message: 'Mission deleted successfully' });
  } catch (error) {
    console.error('Delete mission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllMissions, createMission, updateMission, deleteMission };
