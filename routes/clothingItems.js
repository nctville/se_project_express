const router = require("express").Router()
const {createItem, getItems, deleteItem, likeItem,
  dislikeItem} = require("../controllers/clothingItem");
const authenticateUser = require("../middleware/auth");

router.get("/", getItems)

router.use(authenticateUser); // protecting routes

router.post("/", createItem)
router.delete("/:itemId", deleteItem)
router.put("/:itemId/likes", likeItem); // Route for liking an item
router.delete("/:itemId/likes", dislikeItem); // Route for disliking an item

module.exports = router