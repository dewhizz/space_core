const {Property,Inquiry,Booking}=require('../model/SpaceDB')

// get all dashBoard stats
exports.ownerDashStats=async(req,res)=>{
    try {
        const userId=req.user.userId
        // we run all count operations parallel for better performance
        const [totalProperties, totalInquiries, totalBookings] =
          await Promise.all([
            Property.countDocuments({ user: userId }),
            Inquiry.countDocuments({ user: userId }),
            Booking.countDocuments({ user: userId }),
          ]);
        // get the most recent Inquiry to be registered
        const recentInquiry = await Inquiry.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5);
        // get the most recent bookings
        const recentBooking = await Booking.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(5);

        // return all stats
        res.status(200).json({
          totalProperties,
          totalInquiries,
          totalBookings,
          recentBooking,
          recentInquiry
        });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}