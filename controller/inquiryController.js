const {Inquiry,Property,User}=require('../model/SpaceDB')

// add inquiry
// validate the existence of the user and property
exports.addInquiry=async(req,res)=>{
    try {
        // get the logged in user
        const userId=req.user.userId
        console.log(userId)
        // property inquiry
        const {propertyId,message}=req.body

        // check existence of a property
        const existProperty = await Property.findById(propertyId)
        console.log(existProperty)
        if(!existProperty) return res.status(404).json({message:'Property not found'})

        // create and save the inquiry
        const inquiry=new Inquiry({
            user:userId,
            property:propertyId,
            message
        })
        await inquiry.save()
        res.status(201).json({message:"Inquiry sent successfully",inquiry})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
// get all inquires
exports.getAllInquiries=async(req,res)=>{
    try {
        const inquires=await Inquiry.find()
        .populate('property')
        .populate('user')
        res.status(200).json(inquires)
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}