const {Property,User}=require('../model/SpaceDB')

// require path to show where the file will be stored
const path = require('path')
// require the fs to create a newfile
const fs = require('fs')
// require the multer to handle files
const multer = require('multer')
// the storage location
const upload=multer({dest:'uploads/'})

exports.propertyphoto=async(req,res)=>{
// check if our request has any file
if(req.file){
    // extracting the file's extention
    const ext=path.extname(req.file.originalname)
    // renaming the file 
    const newFilename=Date.now()+ext
    // new path
    const newPath=path.join('uploads',newFilename)
    fs.renameSync(req.file.path,newPath)
    photo=newPath.replace(/\\/g,'/')
 }
}
// add properties
exports.addProperty=async(req,res)=>{
    try {
        // recieve data from the client
        const newProperty={...req.body, //This spreads all fields from the request body (e.g., plotNumber, address, etc.)
            owner:req.params.id //This adds the owner ID from the URL parameter
        }
        console.log("incoming....",newProperty)
        const savedProperty=new Property(newProperty)
        await savedProperty.save()
        res.status(201).json(savedProperty)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetching all properties
exports.getAllProperties=async (req,res)=>{
    try {
        const properties=await Property.find()
        .populate('owner','name email phone')
        // console.log('incoming',typeofres)
        res.json(properties)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get one
exports.getProperiesById=async (req,res)=>{
    try {
        const property = await Property.findById(req.params.id)
        .populate('owner','name email phone')
        // check if the property exsists
        if(!property) return res.status(404).json({message:'property not found'})
            res.status(200).json(property)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update the property
exports.updateProperty=async(req,res)=>{
    try {
        const updateProperty=await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        if(!updateProperty) return res.status(404).json({message:'property not found'})
            res.status(200).json(updateProperty)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// delete property
exports.deleteProperties=async(req,res)=>{
    try {
        // find the classroom by id
        const deletedProperty=await Property.findByIdAndDelete(req.params.id)
        if(!deletedProperty) return res.status(404).json({message:'property not found'})
            res.json({message:'property deleted successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

