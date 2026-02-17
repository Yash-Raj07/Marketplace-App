import express from 'express';
import { body, query } from 'express-validator';
import { authenticate, handleValidationErrors } from '../middleware.js';
import { getAsync, runAsync, allAsync } from '../database.js';

const router = express.Router();

// Create product (admin only for now)
router.post(
  '/',
  authenticate,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, price, image } = req.body;

      const result = await runAsync(
        'INSERT INTO products (title, description, price, image) VALUES (?, ?, ?, ?)',
        [title, description, parseFloat(price), image || null]
      );

      res.status(201).json({
        id: result.id,
        title,
        description,
        price,
        image,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get all products with search and pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = 'WHERE title LIKE ? OR description LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm];
    }

    // Get total count
    const countResult = await getAsync(
      `SELECT COUNT(*) as count FROM products ${whereClause}`,
      params
    );

    // Get paginated products
    const products = await allAsync(
      `SELECT * FROM products ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    res.json({
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: countResult.count,
        pages: Math.ceil(countResult.count / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await getAsync('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().notEmpty(),
    body('description').optional().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('image').optional().isURL(),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, price, image } = req.body;
      const updates = [];
      const params = [];

      if (title !== undefined) {
        updates.push('title = ?');
        params.push(title);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        params.push(parseFloat(price));
      }
      if (image !== undefined) {
        updates.push('image = ?');
        params.push(image);
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      params.push(req.params.id);

      await runAsync(
        `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
        params
      );

      const product = await getAsync('SELECT * FROM products WHERE id = ?', [req.params.id]);
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Delete product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await runAsync('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
