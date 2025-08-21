const { Inquiry, Booking } = require("../model/SpaceDB");

exports.getUserDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Run counts in parallel
    const [totalInquiries, totalBookings] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId }),
    ]);

    // Recent inquiries with property title and image
    const recentInquiries = await Inquiry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property")
      .lean();

    // Recent bookings with property title and image
    const recentBookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property")
      .lean();

    // Format response
    res.status(200).json({
      totalInquiries,
      totalBookings,
      recentInquiries: recentInquiries.map((inq) => ({
        propertyTitle: inq.property?.title || "N/A",
        propertyImage: inq.property?.image || null,
        message: inq.message,
        response: inq.response,
        status: inq.status,
      })),
      recentBookings: recentBookings.map((book) => ({
        propertyTitle: book.property?.title || "N/A",
        propertyImage: book.property?.image || null,
        startDate: book.startDate,
        endDate: book.endDate,
        status: book.status,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch dashboard stats" });
  }
};