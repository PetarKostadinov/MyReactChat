const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { registerUser, allUsers, loginUser } = require('../controllers/userControlloer');


const router = express.Router();

router.route('/').post(registerUser).get(protect, allUsers)
router.post('/login', loginUser)


module.exports = router;