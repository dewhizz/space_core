const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController")

// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",upload.single('photo'),addProperty);
router.get("/",propertyController.getAllProperties);
router.get("/:id",propertyController.getProperiesById);
router.put("/:id",propertyController.updateProperty);
router.delete("/:id",propertyController.deleteProperties);
module.exports = router;
