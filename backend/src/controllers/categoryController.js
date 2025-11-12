const pool = require('../config/database');

const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM goal_categories WHERE user_id = $1 ORDER BY name ASC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO goal_categories (user_id, name) VALUES ($1, $2) RETURNING *',
      [req.userId, name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM goal_categories WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllCategories, createCategory, deleteCategory };
