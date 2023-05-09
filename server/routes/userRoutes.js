const express = require('express');
const { registerUser } = require('../controlers/userControloer');

const router = express.Router();

router.post('/register', registerUser)
// router.post('/login', authUser)

module.exports = router;