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

//  Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title location")
      .populate("user", "name email phone");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Get Booking by ID
exports.getById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property", "title location")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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