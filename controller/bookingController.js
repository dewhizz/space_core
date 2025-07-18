const {Inquiry,Property, Booking}=require('../model/SpaceDB')

// add booking
exports.addBooking=async (req,res)=>{
    try {
       const userId=req.params.id
       const {propertyId}=req.body

    //    check if the user has already inquired about the property
    const previousInquiry=await Inquiry.findOne({property:propertyId,createdBy:userId})
    if(!previousInquiry){
        return res.status(403).json({message:'You mus inquire first'})
     }
        // create the booking
        const newBooking=new Booking({
            ...req.body,
            bookedBy:userId,
         })
         const savedBooking=await newBooking.save()

         res.status(200).json(savedBooking)

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// fetch all booking requests
exports.getAllBookings=async(req,res)=>{
  try {
      const booking=await Booking.find()
    .populate('property')
    .populate('createdBy','name email phone')
    res.status(200).json(booking)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

// fetch one
exports.getById=async(req,res)=>{
   try {
    const booking=await Booking.findById(req.params.id)
    .populate('createdBy','name email phone')
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
  const bookingId=req.params.id
  const existBooking=await Booking.findOneAndUpdate(bookingId)
  if(!existBooking){
    return res.status(200).json({message:'Booking not found'})
  }
  // unassign booking to createdBy
  await Booking.updateMany(
    {createdBy:userId},
    {$set:{teacher:null}}
  )
  res.status(200).json({message:'Booking deleted successfully'})
}