const router = require("express").Router()


const {createItem, getItems, deleteItem, likeItem,
  dislikeItem} = require("../controllers/clothingItem")




router.post("/", createItem)
router.get("/", getItems)

router.delete("/:itemId", deleteItem)
router.put("/:itemId/like", likeItem); // Route for liking an item
router.delete("/:itemId/like", dislikeItem); // Route for disliking an item

module.exports = router