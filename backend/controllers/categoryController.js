const express = require('express');
const router = express.Router();
const db = require('../db'); // your DB connection

// GET all categories
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// POST create category
router.post('/', (req, res) => {
  const { categoryName } = req.body;
  db.query('INSERT INTO categories (categoryName) VALUES (?)',
    [categoryName],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, categoryName });
    });
});

// PUT update category
router.put('/:id', (req, res) => {
  const { categoryName } = req.body;
  db.query('UPDATE categories SET categoryName = ? WHERE id = ?',
    [categoryName, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Updated successfully' });
    });
});

// DELETE category
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM categories WHERE id = ?', [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Deleted successfully' });
    });
});

module.exports = router;