const express=require('express')
const router=express.Router()
const propertyController=require('../controller/propertyController')

router.post('/',propertyController.addProperty)
router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getProperiesById);
router.put("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperties);
module.exports=router