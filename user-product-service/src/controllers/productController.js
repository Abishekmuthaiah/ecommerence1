const { Op } = require('sequelize');
const { Product, Category } = require('../models');

// Helper to create slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Fetch all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const offset = (page - 1) * limit;

    const { search, q, category, minPrice, maxPrice, sort, featured, inStock } = req.query;

    const whereClause = {};

    // Search filter
    const keyword = search || q;
    if (keyword) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } },
        { category: { [Op.like]: `%${keyword}%` } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'all') {
      whereClause.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // Featured flag
    if (featured === 'true' || featured === true) {
      whereClause.is_featured = true;
    }

    // In-Stock filter
    if (inStock === 'true' || inStock === true) {
      whereClause.stock = { [Op.gt]: 0 };
    }

    // Sorting
    let orderClause = [['created_at', 'DESC']];
    if (sort === 'price_asc') {
      orderClause = [['price', 'ASC']];
    } else if (sort === 'price_desc') {
      orderClause = [['price', 'DESC']];
    } else if (sort === 'rating') {
      orderClause = [['rating', 'DESC']];
    } else if (sort === 'name_asc') {
      orderClause = [['name', 'ASC']];
    } else if (sort === 'oldest') {
      orderClause = [['created_at', 'ASC']];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      include: [
        {
          model: Category,
          as: 'categoryDetails',
          attributes: ['id', 'name', 'slug'],
        },
      ],
    });

    res.json({
      success: true,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      limit,
      products,
    });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching products',
    });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'categoryDetails',
          attributes: ['id', 'name', 'slug', 'description'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID ${req.params.id} not found`,
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product details',
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_price,
      image,
      category,
      category_id,
      stock,
      rating,
      is_featured,
    } = req.body;

    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required product fields: name, description, price, image, category',
      });
    }

    const slug = slugify(name) + '-' + Date.now().toString().slice(-4);

    const product = await Product.create({
      name,
      slug,
      description,
      price: parseFloat(price),
      discount_price: discount_price ? parseFloat(discount_price) : null,
      image,
      category,
      category_id: category_id || null,
      stock: parseInt(stock, 10) || 0,
      rating: rating ? parseFloat(rating) : 4.5,
      is_featured: is_featured || false,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating product',
    });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const {
      name,
      description,
      price,
      discount_price,
      image,
      category,
      category_id,
      stock,
      rating,
      is_featured,
    } = req.body;

    if (name) {
      product.name = name;
      product.slug = slugify(name);
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (discount_price !== undefined) product.discount_price = discount_price ? parseFloat(discount_price) : null;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (category_id !== undefined) product.category_id = category_id;
    if (stock !== undefined) product.stock = parseInt(stock, 10);
    if (rating !== undefined) product.rating = parseFloat(rating);
    if (is_featured !== undefined) product.is_featured = is_featured;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating product',
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting product',
    });
  }
};

// @desc    Reduce product stock (for Order service cross-call)
// @route   POST /api/products/reduce-stock
// @access  Public / Internal Service
const reduceStock = async (req, res) => {
  try {
    const { items } = req.body; // array of { product_id, quantity }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required',
      });
    }

    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (product) {
        product.stock = Math.max(0, product.stock - (parseInt(item.quantity, 10) || 1));
        await product.save();
      }
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error reducing product stock',
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  reduceStock,
};
