import express from 'express';
import { authenticate } from '../middleware.js';
import { getAsync, runAsync, allAsync } from '../database.js';

const router = express.Router();

// Add to favorites
router.post('/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    // Check if product exists
        const token = jwt.sign({ id: result.id, email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({
        token,
        user: { id: result.id, email, name },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Remove from favorites
router.delete('/:productId', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    await runAsync(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's favorites
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    const countResult = await getAsync(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
      [userId]
    );

    const favorites = await allAsync(
      `SELECT p.* FROM products p
       INNER JOIN favorites f ON p.id = f.product_id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, limitNum, offset]
    );

    res.json({
      data: favorites,
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

// Check if product is in favorites
router.get('/:productId/check', authenticate, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const favorite = await getAsync(
      'SELECT id FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ isFavorite: !!favorite });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
