const express=require('express')
const router=express.Router()
const loginController=require('../controller/loginController')
const auth=require('../middleware/auth')

router.post('/register',loginController.register)
router.post('/',loginController.login)

module.exports=router