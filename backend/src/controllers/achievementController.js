const pool = require('../config/database');

const getAllAchievements = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM achievements WHERE user_id = $1 ORDER BY unlocked_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createAchievement = async (req, res) => {
  const { title, description, icon } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO achievements (user_id, title, description, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, title, description, icon]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteAchievement = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM achievements WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Delete achievement error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllAchievements, createAchievement, deleteAchievement };
