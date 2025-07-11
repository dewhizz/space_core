// entry file
const express=require('express')
const mongoose= require('mongoose')
const cors = require('cors')
require('dotenv').config()

// middleware
const app = express()
app.use(express.json())
app.use(cors())

// static file accessibility
app.use('/uploads',express.static('uploads'))

// // login/register routes
const userAuth=require('./routes/loginRoutes')
app.use('/user/Auth',userAuth)

// connection to the db
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(`MongoDB connection error ${err}`))

// listener
const PORT = 3002
app.listen(PORT,()=>{
    console.log("Server Running on Port ",PORT)
})

