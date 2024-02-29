const router = require("express").Router(); // Import express router

const ClothingItem = require("../models/clothingItem")

const createItem = (req, res)=>{
  console.log(req)
  console.log(req.body)

  const {name, weather, imageURL} = req.body;

  ClothingItem.create({name, weather, imageURL}).then((item)=>{
    console.log(item)
    res.send({data:item}).catch((e)=>{
      res.status(500).send({message: `Error from createItem`, e})
    })
  })
}


const getItems =(req, res)=>{
  ClothingItem.find({}). then((items)=> res.status(200).send(items))
  .catch((e)=>{
    res.status(500).send({message: "Get Items failed", e})
  })
}

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then(item => res.status(200).send({ data: item }))
    .catch(e => res.status(500).send({ message: "Update Item failed", e }));
}

const deleteItem = (req, res)=>{
  const { itemId } = req.params;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(item => res.status(204).send({}))
    .catch(e => res.status(500).send({ message: "Delete Item failed", e }));
}

module.exports={
  createItem, getItems, updateItem, deleteItem
}
