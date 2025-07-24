const express = require("express");
const router = express.Router();
const inquiryController = require("../controller/inquiryController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,inquiryController.addInquiry);
router.get("/",inquiryController.getAllInquiries);
router.get("/:id",auth,inquiryController.getOneById);
router.put("/:id",auth,inquiryController.updateInquiry);
router.delete("/:id", auth, inquiryController.deleteInquiry);

//response by the owner
router.put("/response/:id", auth, inquiryController.respondToInquiry);


module.exports = router;
