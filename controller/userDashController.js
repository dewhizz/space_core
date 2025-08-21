const { Inquiry, Booking } = require("../model/SpaceDB");

exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Run count operations in parallel
    const [totalInquires, totalBookings] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId }),
    ]);

    // Get recent inquiries (sorted by newest)
    const recentInquiries = await Inquiry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property");

    // Get recent bookings (sorted by newest)
    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property");

    // Return all stats
    res.status(200).json({
      totalInquires, // ✅ matches frontend expectation
      totalBookings,
      recentInquiries: recentInquiries.map((inquiry) => ({
        propertyTitle: inquiry.property?.title || "N/A",
        propertyImage: inquiry.property?.photo || null,
        message: inquiry.message || "",
        response: inquiry.response || "",
        status: inquiry.status || "pending",
      })),
      recentBookings: recentBookings.map((booking) => ({
        propertyTitle: booking.property?.title || "N/A",
        propertyImage: booking.property?.photo || null,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status || "pending",
      })),
    });
  } catch (error) {
    console.error("Error fetching user dashboard stats:", error);
    res.status(500).json({ message: error.message });
  }
};