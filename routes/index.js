const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Error handler for routes that don't match any defined route
router.use((req, res) => {
  res.status(BAD_REQUEST).send({ message: "Route not found" });
});

module.exports = router;
