const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");

// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/", propertyController.addProperty);
router.get("/",auth,authorizeRoles("owner"),propertyController.getAllProperties);
router.get("/:id",auth,authorizeRoles("owner"),propertyController.getProperiesById);
router.put("/:id",auth,authorizeRoles("owner"),propertyController.updateProperty);
router.delete("/:id",auth,authorizeRoles("owner"),propertyController.deleteProperties);
module.exports = router;
