const db = require('../db');

exports.createProduct = (req, res) => {
  const { name, category_id } = req.body;

  db.query(
    'INSERT INTO products (name, category_id) VALUES (?, ?)',
    [name, category_id],
    (err, result) => res.send(result)
  );
};

exports.getProducts = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let offset = (page - 1) * limit;

  const query = `
    SELECT p.id AS productId,
           p.name AS productName,
           c.id AS categoryId,
           c.name AS categoryName
    FROM products p
    JOIN categories c ON p.category_id = c.id
    LIMIT ? OFFSET ?
  `;

  db.query(query, [limit, offset], (err, result) => {
    res.send(result);
  });
};

exports.deleteProduct = (req, res) => {
  db.query('DELETE FROM products WHERE id=?',
    [req.params.id],
    (err, result) => res.send(result)
  );
};

router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;  // page 9 → offset 80

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

  const countQuery = `SELECT COUNT(*) as total FROM products`;

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