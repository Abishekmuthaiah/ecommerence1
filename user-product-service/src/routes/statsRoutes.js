const express = require('express');
const router = express.Router();
const { User, Product, Category } = require('../models');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/summary', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'customer' } });
    const totalAdmins = await User.count({ where: { role: 'admin' } });
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    const lowStockProducts = await Product.count({ where: { stock: { [require('sequelize').Op.lte]: 5 } } });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalCategories,
        lowStockProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
