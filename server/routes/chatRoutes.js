const express = require('express');
const protect = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroupChat } = require('../controllers/chatControllers');

const router = express.Router();

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroupChat);
router.route('/groupremove').put(protect, removeFromGroupChat);
router.route('/groupadd').put(protect, addToGroup);

module.exports = router;