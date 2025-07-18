const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,bookingController.addBooking);
router.get("/",auth,bookingController.getAllBookings);
router.get("/:id",auth,bookingController.getById);
router.put("/:id",auth,bookingController.updateBooking);
router.delete("/:id",auth,authorizeRoles('owner'),bookingController.deleteBooking);
module.exports = router;
