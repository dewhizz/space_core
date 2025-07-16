const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,propertyController.addProperty);
router.get("/",propertyController.getAllProperties);
router.get("/:id",propertyController.getProperiesById);
router.put("/:id",auth,authorizeRoles('owner'),propertyController.updateProperty);
router.delete("/:id",auth,authorizeRoles('owner'),propertyController.deleteProperties);
module.exports = router;
