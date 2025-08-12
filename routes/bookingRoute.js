const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/:id",auth,bookingController.addBooking)

// user
router.get("/my-bookings",auth,bookingController.getMyBookings);

// owner
router.get("/owner-bookings", auth,authorizeRoles('owner'), bookingController.getBookingsForMyProperties);

router.put("/:id",auth,bookingController.updateBooking);
router.delete("/:id",auth,bookingController.deleteBooking);
module.exports = router;
