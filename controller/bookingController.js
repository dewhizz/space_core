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

// fetch all
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