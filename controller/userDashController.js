const {Inquiry,User,Booking}=require('../model/SpaceDB')

// User's Dashboard
exports.userDash=async(req,res)=>{
    try {
        const userId = req.user.userId
        // we run all count opertaions parallel for better performance
        const [totalInquires,totalBookings]= 
        await Promise.all([
            Inquiry.countDocuments({user:userId}),
            Booking.countDocuments({user:userId}) 
        ])

        // get the most recent inquiry to be registered
        const recentInquiries=await Inquiry.find({user:userId})
        .sort({createdAt:-1})
        .limit(5)

        // get the most recent booking to be registered
        const recentBookings=await Booking.find({user:userId})
        .sort({createdAt:-1})
        .limit(5)

        // return all stats
        res.status(200).json({
            totalInquires,
            totalBookings,
            recentInquiries,
            recentBookings
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}