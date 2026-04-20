const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes  = require('./routes/productRoutes');

app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));