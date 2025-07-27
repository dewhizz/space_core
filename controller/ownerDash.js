const { Property, Inquiry, Booking } = require('../model/SpaceDB');

exports.ownerDashStats = async (req, res) => {
  try {
    const userId = req.user.userId; // pulled from token-auth middleware

    // count only resources associated with the current owner
    const [totalProperties, totalInquiries, totalBookings] = await Promise.all([
      Property.countDocuments({ owner: userId }),
      Inquiry.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId }),
    ]);

    // get most recent resources scoped to the current user
    const recentProperties = await Property.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentInquiry = await Inquiry.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBooking = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProperties,
      totalInquiries,
      totalBookings,
      recentProperties,
      recentInquiry,
      recentBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};