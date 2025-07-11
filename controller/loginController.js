const {User}=require('../model/SpaceDB')
const bcrypt=require('bcrypt')

// register logic
exports.register=async(req,res)=>{
    const{name,email,password,idNumber,secretKey}=req.body
    console.log(name,email,password,idNumber,secretKey)
    // verify the secret key
    if(secretKey !== process.env.secretKey){
        return res.status(403).json({message:'Unauthorized Account Creation'})
    }
    // check if the user exsists
    const userExsist= await user.findOne({email})
    if(userExsist){
        return returnres.json({message:'Email Already Exsists'})
    }
    // hashing the password
    const hashedPassword=await bcrypt.hash(password,10)
    const user = new User({
        name,
        email,
        password:hashedPassword,
        idNumber,
        role:'tenant',
        isActive:true

    })

    res.json({message:"created successfully"})

}