const express = require("express");
const router = express.Router();
const ownerDash = require("../controller/ownerDash")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth")

router.get("/",auth,authorizeRoles('owner'),ownerDash.ownerDashStats);

module.exports = router;
