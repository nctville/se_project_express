const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");
const {login, createUser} = require("../controllers/users")


// Include the signin and signup routes
router.post('/signin', login); // Route for user signin
router.post('/signup', createUser); // Route for user signup

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);


// Error handler for routes that don't match any defined route
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
