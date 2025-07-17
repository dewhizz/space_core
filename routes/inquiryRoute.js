const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,inquiryController.addInquiry);
router.get("/",auth,inquiryController.getAllInquiries);
router.get("/:id",auth,inquiryController.getOneById);
router.put("/:id",auth,authorizeRoles('user'),inquiryController.updateInquiry);
router.delete("/:id",auth,authorizeRoles('user'),inquiryController.deleteInquiry);

module.exports = router;
