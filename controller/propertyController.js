const {Property,User}=require('../model/SpaceDB')

const multer =require('multer')
const fs=require('fs')
const path=require('path')

// file location folder/directory
const upload=multer({dest:'uploads/'})

// add properties
exports.uploadPropertyPhoto=upload.single('photo')
exports.addProperty=async(req,res)=>{
    try {
         const {plotNumber,title,description} =req.body
         
       // prepare the upload file
       let photo=null
       if(req.file){
            const ext=path.extname(req.file.originalname)
            const newFileName=Date.now()+ext
            const newPath = path.join('uploads',newFileName)
            fs.renameSync(req.file.path,newPath)
            photo=newPath.replace(/\\/g,'/')
       }
        
        // create a new property
        const savedProperty=new Property({
             plotNumber,
            title,
            photo,
            description
        })
        console.log('inc',savedProperty)

        const owner=req.user.userId
         const newProperty=req.body
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
exports.getPropertiesById=async (req,res)=>{
    try {
        const property = await Property.findById(req.params.id)
        .populate('owner','name email phone')
        console.log('inc',property)
        // check if the property exsists
        if(!property) return res.status(404).json({message:'property not found'})
            res.status(200).json(property)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// Update a property
exports.updateProperty = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const propertyId = req.params.id;
    const updateData = req.body;

    // Check if the user is authenticated
    if (!ownerId) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Check if the property exists
    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ensure the logged-in user is the owner of the property
    if (existingProperty.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }


    // Perform the update
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true } // return the updated document
    );

    res.status(200).json({
      message: 'Property updated successfully',
      updatedProperty
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// delete property
exports.deleteProperties=async(req,res)=>{
   try {
        // find the property by id first
        const property=await Property.findById(req.params.id)
        if(!property) return res.status(404).json({message:'Property Not Found'})

        // check ownership before deleting
        if(property.owner.toString() !==req.user.userId) return res.status(403).json({message:'Unauthorized Action'})

        // delete the property
        await Property.findByIdAndDelete(req.params.id)
        res.json({message:"Property deleted successfully"})
   } catch (error) {
        res.status(500).json({message:error.message})
   }
}


// transfer Property Ownership
exports.updatePropertyOwnership = async (req, res) => {
  try {
    const currentOwner = req.user.userId;
    const propertyId = req.params.id;
    const newOwnerId = req.body;

    // find the property
    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).json({ message: "Property Not Found" });

    // check if the current owner exists
    if (property.owner.toString() !== currentOwner) {
      return res.status(403).json({ message: "Unauthorized transfer request" });
    }

    // verify existence of the new owner
    const newOwner = await User.findOne(newOwnerId);
    if (!newOwner) {
      return res.status(404).json({ message: "User Not found please sign up" });
    }

    // transfer the ownership
    property.currentOwner = newOwner;
    await property.save();

    res
      .status(200)
      .json({ message: "Ownership transfer successfull", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

