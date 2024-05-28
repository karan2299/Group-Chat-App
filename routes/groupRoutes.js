const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, groupController.createGroup);
router.delete('/delete/:id', authMiddleware, groupController.deleteGroup);
router.get('/search', authMiddleware, groupController.searchGroups);
router.post('/add-member', authMiddleware, groupController.addMember);

module.exports = router;
