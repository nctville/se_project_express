const router = require("express").Router();
const { getUserById } = require('../controllers/users');
const authenticateUser = require('../middleware/auth');
// const { getUsers, createUser, getUserById } = require("../controllers/users");

// GET /users/me route
router.get('/me', authenticateUser, getUserById);
// PATCH /users/me route
router.patch('/me', authenticateUser, getUserById);




// router.get("/", getUsers);
// router.get("/:userId", getUserById);
// router.post("/", createUser);


module.exports = router;
