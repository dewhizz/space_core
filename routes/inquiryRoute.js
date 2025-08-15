const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController");

// Auth middleware
const { auth, authorizeRoles } = require("../middleware/auth");

// Create inquiry (User only)
router.post("/", auth, authorizeRoles("user"), inquiryController.addInquiry);

// Get inquiries
router.get("/my-inquiries", auth, authorizeRoles("user"), inquiryController.getUserInquiries);
router.get("/owner-inquiries", auth, authorizeRoles("owner"), inquiryController.getOwnerInquiries);

// Update inquiry (User can update message, Owner can update status)
router.put("/:id", auth, authorizeRoles("user", "owner"), inquiryController.updateInquiry);

// Delete inquiry (User only)
router.delete("/:id", auth, authorizeRoles("user"), inquiryController.deleteInquiry);

// Respond to inquiry (Owner only, after approval)
router.put("/respond/:id", auth, authorizeRoles("owner"), inquiryController.respondToInquiry);

// Add message to inquiry (User or Owner)
router.post("/:id/messages", auth, authorizeRoles("user", "owner"), inquiryController.addMessageToInquiry);

module.exports = router;