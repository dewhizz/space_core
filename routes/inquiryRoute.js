const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,inquiryController.addInquiry);

// // user inquires
router.get("/my-inquires",auth,authorizeRoles('user'),inquiryController.getUserInquiries);

// // owner inquires
router.get("/owner-inquires",auth,authorizeRoles('owner'),inquiryController.getOwnerInquiries);



router.put("/:id",auth,inquiryController.updateInquiry);
router.delete("/:id", auth,authorizeRoles('user'), inquiryController.deleteInquiry);

//response by the owner
router.put("/response/:id", auth, inquiryController.respondToInquiry);

module.exports = router;
