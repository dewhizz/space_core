 const { User } = require('../model/SpaceDB')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// register logic
exports.register = async (req, res) => {
    const { name, email, password, idNumber, secretKey } = req.body
    // console.log('incoming data',req.body)
    // verify the secret key
    let assignedRole;
if (secretKey !== process.env.secretKey) {
    return res.status(403).json({ message: 'Unauthorized Account Creation' });
}
    // check if the user exsists
    const userExsist = await User.findOne({ email })
    if (userExsist) {
        return res.json({ message: 'Email Already Exsists' })
    }
    const idExsists=await User.findOne({idNumber})
    if(idExsists){
        return res.json({message:"Id Number Already Registered"})
    }
    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({
        name,
        email,
        password: hashedPassword,
        idNumber,
        role:'user',
        isActive: true

    })
    const newUser = await user.save()
    res.status(201).json({ message: "created successfully", newUser })//

}


// login
exports.login = async (req, res) => {
    // destructure
    const { email, password } = req.body
    console.log("log in details", req.body)
    // check if user email exists
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: 'Invalid user credentials....' })
    }
    console.log(user)
    // check if the user is valid
    if (!user.isActive) {
        return res.status(403).json({ message: 'Your account has been deactivated' })
    }
    // check the password
    const isMatch =await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid user credentials" })
    }
   
// generate the jwt token
  const token = jwt.sign(
    { userId: user._id,role:user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
 res.json({
        message: 'log in successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

    })
}

// fetch all
exports.getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
