const {Inquiry, Booking}=require('../model/SpaceDB')

// add booking
exports.addBooking=async (req,res)=>{
    try {
      
       const user=req.user.userId
       const {property,startDate,endDate}=req.body
       const inquiry=req.params.id

    //    check if the user has already inquired about the property
    const previousInquiry=await Inquiry.findOne({inquiry})
    if(!previousInquiry){
        return res.status(403).json({message:'You must inquire first'})
     }
        // create the booking
        const newBooking=new Booking({
            property,
            startDate,
            endDate,
            user
          })
         const savedBooking=await newBooking.save()

         res.status(200).json({message:'your booking was successfully added',savedBooking})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetch all booking requests
exports.getAllBookings=async(req,res)=>{
  try {
      const booking=await Booking.find()
    .populate('property')
    .populate('user','name email phone')
    res.status(200).json(booking)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// fetch one
exports.getById=async(req,res)=>{
   try {
    const booking=await Booking.findById(req.params.id)
    .populate('user','name email phone')
    if(!booking)return res.status(404).json({message:'Booking not found'})
        res.status(200).json(booking)
   } catch (error) {
    res.status(500).json({message:error.message})
   }
}

// update
exports.updateBooking=async(req,res)=>{
  try {
    // find the booking
    const updateBooking=await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    )
    if(!updateBooking) return res.status(404).json({message:"booking not found"})
      res.status(201).json({message:'booking updated successfully',updateBooking})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// delete Booking
exports.deleteBooking=async(req,res)=>{
  try {
    // extract the userId from the booking
    const userId=req.user.userId
    const booking=req.params.id

     const existBooking = await Booking.findByIdAndDelete(booking);
     
     if (!existBooking) {
       return res.status(404).json({ message: "Booking not found" });
     }
     // unassign booking to createdBy
     await Inquiry.updateMany({ user: userId }, { $set: { user: null } });
     res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}