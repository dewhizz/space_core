const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,authorizeRoles('user'),inquiryController.addInquiry);

// user inquires
router.get("/my-inquires",auth,authorizeRoles('user'),inquiryController.getUserInquiries);

// owner inquires
router.get("/owner-inquires",auth,authorizeRoles('owner'),inquiryController.getOwnerInquiries);



router.put("/:id",auth,authorizeRoles('user',"owner"),inquiryController.updateInquiry);
router.delete("/:id", auth, inquiryController.deleteInquiry);

//response by the owner
router.put("/response/:id", auth, inquiryController.respondToInquiry);

//  a message to an inquiry thread (user or owner)
router.post("/:id/messages", auth, inquiryController.addMessageToInquiry);

//  Filter inquiries by status (e.g., ?status=pending)
router.get("/my-inquiries/filter", auth, authorizeRoles("user"), inquiryController.filterUserInquiriesByStatus);
router.get("/owner-inquiries/filter", auth, authorizeRoles("owner"), inquiryController.filterOwnerInquiriesByStatus);

module.exports = router;
