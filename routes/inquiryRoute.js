const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

// Create inquiry
router.post("/", auth, authorizeRoles('user'), inquiryController.addInquiry);

// Get inquiries
router.get("/my-inquiries", auth, authorizeRoles('user'), inquiryController.getUserInquiries);
router.get("/owner-inquiries", auth, authorizeRoles('owner'), inquiryController.getOwnerInquiries);

// Update & delete inquiries
router.put("/:id", auth, authorizeRoles('user', 'owner'), inquiryController.updateInquiry);
router.delete("/:id", auth, inquiryController.deleteInquiry);

// Owner response
router.put("/response/:id", auth, inquiryController.respondToInquiry);

// Messaging
router.post("/:id/messages", auth, inquiryController.addMessageToInquiry);

module.exports = router; 
