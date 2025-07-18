const express=require('express')
const router=express.Router()
const loginController=require('../controller/loginController')

const {auth, authorizeRoles}=require('../middleware/auth')

router.post('/register',loginController.register)
router.post('/',loginController.login)
router.get('/',loginController.getAllUsers)

module.exports=router