const {Inquiry,Property,User}=require('../model/SpaceDB')

// add inquiry
// validate the existence of the user and property
exports.addInquiry=async(req,res)=>{
    try {
        // get the logged in user
        // const userId=req.user.userId
        // console.log(userId)
        // property inquiry
        const {propertyId,message}=req.body

        // check existence of a property
        const existProperty = await Property.findOne(propertyId)
        console.log(existProperty)
        if(!existProperty) return res.status(404).json({message:'Property not found'})

        // create and save the inquiry
        const inquiry=new Inquiry({
            // user:userId,
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
        .populate('user','name email phone')
        res.status(200).json(inquires)
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// fetch one inquiry
exports.getOneById=async(req,res)=>{
    try {
        
        const property = await Property.findById(req.params.id)
        console.log(req.params.id)
        if(!property) return res.status(404).json({message:'Property not found'})
            res.status(200).json(property)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// update
exports.updateInquiry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inquiryId = req.params.id;

    // Check if the inquiry exists
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    // Check if the logged-in user is the inquiry creator
    if (inquiry.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied: insufficient permission' });
    }

    // Perform the update
    const updatedInquiry = await Inquiry.findByIdAndUpdate(inquiryId, req.body, { new: true });

    return res.status(200).json({
      message: 'Successfully updated your inquiry',
      updatedInquiry,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'An error occurred while updating the inquiry' });
  }
};

// delete inquiry
exports.deleteInquiry=async(req,res)=>{
   try {
     const deleteInquiry=await Inquiry.findByIdAndDelete(req.params.id)
    if(!deleteInquiry) return res.status(404).json({message:'inquiry not found'})
      res.json({message:'Inquiry deleted successfully'})
   } catch (error) {
    res.status(500).json({message:error.message})
   }
}