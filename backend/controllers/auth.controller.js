const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const generateToken = require('../utils/generateToken');

exports.userSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user_id = uuidv4();

    await pool.query(
      `INSERT INTO users (user_id,name,email,password,phone)
       VALUES (?,?,?,?,?)`,
      [user_id, name, email, hashedPassword, phone]
    );

    res.json({
      message: 'User registered',
      token: generateToken(user_id, 'customer'),
      user: {
        id: user_id,
        name,
        email,
        role: 'customer'
      }
    });

  } catch (err) {
    console.error('Signup Error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.merchantSignup = async (req, res) => {
  try {
    const {
      business_name,
      email,
      password,
      category_id,
      description
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const merchant_id = uuidv4();

    // Auto-approve merchants for now (can add admin approval later)
    await pool.query(
      `INSERT INTO merchants
       (merchant_id,business_name,email,password,category_id,description,status)
       VALUES (?,?,?,?,?,?,?)`,
      [merchant_id, business_name, email,
       hashedPassword, category_id, description, 'approved']
    );

    res.json({
      message: 'Merchant registered',
      token: generateToken(merchant_id, 'merchant'),
      user: {
        id: merchant_id,
        business_name,
        email,
        role: 'merchant'
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email=?',
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: 'User not found' });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: 'Wrong password' });

    res.json({
      message: 'Login success',
      token: generateToken(user.user_id, 'customer'),
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: 'customer'
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.merchantLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      'SELECT * FROM merchants WHERE email=?',
      [email]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: 'Merchant not found' });

    const merchant = rows[0];

    const match = await bcrypt.compare(password, merchant.password);

    if (!match)
      return res.status(400).json({ message: 'Wrong password' });

    res.json({
      message: 'Login success',
      token: generateToken(merchant.merchant_id, 'merchant'),
      user: {
        id: merchant.merchant_id,
        business_name: merchant.business_name,
        email: merchant.email,
        role: 'merchant'
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================================
// PROFILE ENDPOINTS
// ============================================

exports.getCustomerProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const [rows] = await pool.query('SELECT password FROM users WHERE user_id = ?', [req.user.id]);
      const match = await bcrypt.compare(currentPassword, rows[0].password);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET name = ?, phone = ?, password = ? WHERE user_id = ?',
        [name, phone, hashed, req.user.id]);
    } else {
      await pool.query('UPDATE users SET name = ?, phone = ? WHERE user_id = ?',
        [name, phone, req.user.id]);
    }

    const [updated] = await pool.query(
      'SELECT user_id, name, email, phone, created_at FROM users WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ message: 'Profile updated', user: updated[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMerchantProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT merchant_id, business_name, email, category_id, description, rating, status, created_at FROM merchants WHERE merchant_id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Merchant not found' });
    res.json({ merchant: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMerchantProfile = async (req, res) => {
  try {
    const { business_name, description, category_id, currentPassword, newPassword } = req.body;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to set a new password' });
      }
      const [rows] = await pool.query('SELECT password FROM merchants WHERE merchant_id = ?', [req.user.id]);
      const match = await bcrypt.compare(currentPassword, rows[0].password);
      if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

      const hashed = await bcrypt.hash(newPassword, 10);
      await pool.query(
        'UPDATE merchants SET business_name = ?, description = ?, category_id = ?, password = ? WHERE merchant_id = ?',
        [business_name, description, category_id, hashed, req.user.id]);
    } else {
      await pool.query(
        'UPDATE merchants SET business_name = ?, description = ?, category_id = ? WHERE merchant_id = ?',
        [business_name, description, category_id, req.user.id]);
    }

    const [updated] = await pool.query(
      'SELECT merchant_id, business_name, email, category_id, description, rating, status, created_at FROM merchants WHERE merchant_id = ?',
      [req.user.id]
    );
    res.json({ message: 'Profile updated', merchant: updated[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};