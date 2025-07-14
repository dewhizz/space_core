const express=require('express')
const router=express.Router()
const propertyController=require('../controller/propertyController')

router.post('/',propertyController.addProperty)
router.get("/", propertyController.getAllProperties);

module.exports=router