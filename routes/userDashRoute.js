const express = require("express");
const router = express.Router();
const userDashController = require("../controller/userDashController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth")

router.get("/",auth,userDashController.getUserDashboardStats);

module.exports = router;
