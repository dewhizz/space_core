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



router.put("/:id",auth,authorizeRoles('user','owner'),inquiryController.updateInquiry);
router.delete("/:id", auth, inquiryController.deleteInquiry);

//response by the owner
router.put("/response/:id", auth, inquiryController.respondToInquiry);

//  a message to an inquiry thread (user or owner)
router.post("/:id/messages", auth, inquiryController.addMessageToInquiry);



module.exports = router; 
