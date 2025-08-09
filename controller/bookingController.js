const { Inquiry, Booking } = require("../model/SpaceDB");

// Add Booking (Only if inquiry is approved)
exports.addBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { property, startDate, endDate } = req.body;
    const inquiryId = req.params.id;

    // 🔍 Find the inquiry by ID and validate ownership
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: This inquiry doesn't belong to you." });
    }

    if (inquiry.status !== "approved") {
      return res.status(403).json({ message: "Your inquiry must be approved before booking." });
    }

    //  Create the booking
    const newBooking = new Booking({
      property,
      startDate,
      endDate,
      user: userId,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json({ message: "Booking successfully created", booking: savedBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const user=req.user.userId
    const bookings = await Booking.find({user})

      .populate("property", "title location")
      .populate("user", "name email phone");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get Bookings Made to My Properties
exports.getBookingsForMyProperties=async (req,res)=>{
  try {
    const ownerId=req.user.userId
    const bookings=await Booking.find()
    .populate({
      path:"property",
      match:{owner:ownerId},
      select:'title location owner'
    })
    .populate('user',"name email phone")

    // Filter out bookings where property didn't match (i.e. not owned by this user)
    const ownedBookings = bookings.filter(b => b.property);

     res.status(200).json(ownedBookings);

  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}
//  Update Booking (Only by creator)
exports.updateBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this booking" });
    }

    const allowedUpdates = ["startDate", "endDate"];
    allowedUpdates.forEach((field) => {
      if (req.body[field]) booking[field] = req.body[field];
    });

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Booking (Only by creator)
exports.deleteBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }

    await booking.deleteOne();
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.respondToBooking = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const booking = await Booking.findById(req.params.id).populate("property");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    //  Check ownership
    if (booking.property.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Unauthorized: You don't own this property." });
    }

    const { status, agreementUrl } = req.body;
    const allowedStatuses = ["approved", "rejected", "confirmed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status. Must be one of: approved, rejected, confirmed." });
    }

    //  If confirming, validate agreement URL
    if (status === "confirmed") {
      if (!agreementUrl || !agreementUrl.startsWith("http")) {
        return res.status(400).json({ message: "Agreement URL is required and must be valid when confirming." });
      }
      booking.agreementUrl = agreementUrl;
      booking.confirmedAt = new Date();
    } else {
      booking.agreementUrl = null; // Clear if not confirmed
      booking.confirmedAt = null;
    }

    booking.status = status;
    await booking.save();

    //  Notify user
    notifyUser(booking.user, `Your booking has been ${status}`, agreementUrl);

    res.status(200).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};