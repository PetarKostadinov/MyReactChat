const express = require('express');
const { registerUser, loginUser, allUsers } = require('../controllers/userControlloer');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers)
router.post('/login', loginUser)


module.exports = router;