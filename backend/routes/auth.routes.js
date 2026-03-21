const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth.middleware');

const {
  userSignup,
  userLogin,
  merchantSignup,
  merchantLogin,
  getCustomerProfile,
  updateCustomerProfile,
  getMerchantProfile,
  updateMerchantProfile
} = require('../controllers/auth.controller');

router.post('/user/signup', userSignup);
router.post('/user/login', userLogin);

router.post('/merchant/signup', merchantSignup);
router.post('/merchant/login', merchantLogin);

// Profile routes (protected)
router.get('/user/profile', protect, getCustomerProfile);
router.put('/user/profile', protect, updateCustomerProfile);
router.get('/merchant/profile', protect, getMerchantProfile);
router.put('/merchant/profile', protect, updateMerchantProfile);

module.exports = router;