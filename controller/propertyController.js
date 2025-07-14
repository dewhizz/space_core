const {Property}=require('../model/SpaceDB')

// add properties
exports.addProperty=async(req,res)=>{
    try {
        // recieve data from the client
        const newProperty=req.body
        console.log("incoming....",newProperty)
        const savedProperty=new Property(newProperty)
        await savedProperty.save()
        res.status(201).json(savedProperty)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetching all classrooms
exports.getAllProperties=async (req,res)=>{
    try {
        const properties=await Property.find()
        .populate('owner','name email phone')
        res.json(properties)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}