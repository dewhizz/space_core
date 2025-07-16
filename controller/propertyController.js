const {Property,User}=require('../model/SpaceDB')

// // require path to show where the file will be stored
// const path = require('path')
// // require the fs to create a newfile
// const fs = require('fs')
// // require the multer to handle files
// const multer = require('multer')
// // the storage location
// const upload=multer({dest:'uploads/'})

// exports.upload=[upload('photo')],async(req,res)=>{
// // check if our request has any file
// if(req.file){
//     // extracting the file's extention
//     const ext=path.extname(req.file.originalname)
//     // renaming the file 
//     const newFilename=Date.now()+ext
//     // new path
//     const newPath=path.join('uploads',newFilename)
//     fs.renameSync(req.file.path,newPath)
//     photo=newPath.replace(/\\/g,'/')
//  }
// }


// add properties
exports.addProperty=async(req,res)=>{
    try {
         const newProperty=req.body
        // create a new property
        const savedProperty=new Property(newProperty)
        console.log('inc',savedProperty)
        await savedProperty.save()
        res.json(savedProperty)
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
exports.updateProperty = async (req, res) => {
  try {
    const updateData = req.body;

    // Check if the property exists
    const existProperty = await Property.findById(req.params.id);
    if (!existProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    if(existProperty.owner.toString() !== req.user.userId){
        return res.status(403).json({message:'Unauthorized action'})
    }
    // Update using the same ID from req.params
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('Updated Property:', updatedProperty);
    res.status(200).json({ message: "Property updated successfully", updatedProperty });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

