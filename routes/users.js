const router = require("express").Router();
const { getUserById } = require('../controllers/users');
const {updateUserProfile} = require('../controllers/users')
const authenticateUser = require('../middleware/auth');
// const { getUsers, createUser, getUserById } = require("../controllers/users");

// GET /users/me route
router.get('/me', authenticateUser, getUserById);
// PATCH /users/me route
router.patch('/me', authenticateUser, updateUserProfile);



module.exports = router;
