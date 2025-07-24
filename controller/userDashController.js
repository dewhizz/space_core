const {Inquiry,User,Booking}=require('../model/SpaceDB')

// User's Dashboard
exports.userDash=async(req,res)=>{
    try {
        // we run all count opertaions parallel for better performance
        const [totalInquires,totalBookings]= 
        await Promise.all([
            Inquiry.countDocuments(),
            Booking.countDocuments() 
        ])

        // get the most recent inquiry to be registered
        const recentInquiries=await Inquiry.find()
        .sort({createdAt:-1})
        .limit(5)

        // get the most recent booking to be registered
        const recentBookings=await Booking.find()
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