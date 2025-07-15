const {Property}=require('../model/SpaceDB')

// add properties
exports.addProperty=async(req,res)=>{
    try {
        // recieve data from the client
        const newProperty={...req.body,
            owner:req.user.id
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
            res.status(200).json({property})
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

