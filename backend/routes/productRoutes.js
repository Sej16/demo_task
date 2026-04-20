const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - paginated products
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;

  const countQuery = 'SELECT COUNT(*) as total FROM products';
  const dataQuery = `
    SELECT 
      p.id,
      p.productName,
      p.categoryId,
      c.categoryName
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LIMIT ? OFFSET ?
  `;

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json({ error: err });
    const total = countResult[0].total;

    db.query(dataQuery, [pageSize, offset], (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        data: rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      });
    });
  });
});

// POST - add product
router.post('/', (req, res) => {
  const { productName, categoryId } = req.body;

  if (!productName || !categoryId) {
    return res.status(400).json({ error: 'productName and categoryId required' });
  }

  db.query(
    'INSERT INTO products (productName, categoryId) VALUES (?, ?)',
    [productName, Number(categoryId)],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, productName, categoryId });
    }
  );
});

// PUT - update product
router.put('/:id', (req, res) => {
  const { productName, categoryId } = req.body;

  if (!productName || !categoryId) {
    return res.status(400).json({ error: 'productName and categoryId required' });
  }

  db.query(
    'UPDATE products SET productName = ?, categoryId = ? WHERE id = ?',
    [productName, Number(categoryId), req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Updated successfully' });
    }
  );
});

// DELETE - delete product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM products WHERE id = ?', [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Deleted successfully' });
    });
});

module.exports = router;