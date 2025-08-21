const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/:id",auth,bookingController.addBooking)

// user
router.get("/my-bookings",auth,bookingController.getMyBookings);

// router.put("/owner/:id",auth,authorizeRoles('owner'),bookingController.respondToBooking);

// owner
router.get("/owner-bookings", auth,authorizeRoles('owner'), bookingController.getBookingsForMyProperties);

router.put("/:id",auth,authorizeRoles('user','owner'),bookingController.updateBooking);

router.delete("/:id",auth,bookingController.deleteBooking);
module.exports = router;
