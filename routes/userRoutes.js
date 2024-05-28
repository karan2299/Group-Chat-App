const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', authMiddleware, userController.logoutUser);

// Admin only routes
router.post('/create', authMiddleware, adminMiddleware, userController.createUser);
router.put('/edit/:id', authMiddleware, adminMiddleware, userController.editUser);

module.exports = router;
