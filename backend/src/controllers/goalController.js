const pool = require('../config/database');

const getAllGoals = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createGoal = async (req, res) => {
  const { title, description, target, current, category, difficulty } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO goals (user_id, title, description, target, current, category, difficulty) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.userId, title, description, target || 100, current || 0, category, difficulty || 'normal']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { title, description, target, current, category, difficulty } = req.body;

  try {
    const result = await pool.query(
      'UPDATE goals SET title = COALESCE($1, title), description = COALESCE($2, description), target = COALESCE($3, target), current = COALESCE($4, current), category = COALESCE($5, category), difficulty = COALESCE($6, difficulty), updated_at = NOW() WHERE id = $7 AND user_id = $8 RETURNING *',
      [title, description, target, current, category, difficulty, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM goals WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllGoals, createGoal, updateGoal, deleteGoal };
