const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",propertyController.addProperty);
router.get("/",propertyController.getAllProperties);
router.get("/:id",propertyController.getPropertiesById);
router.put("/:id",auth,authorizeRoles('owner'),propertyController.updateProperty);
router.delete("/:id",auth,authorizeRoles('owner'),propertyController.deleteProperties);
module.exports = router;
