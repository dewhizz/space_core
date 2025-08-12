const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController")


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,propertyController.uploadPropertyPhoto,propertyController.addProperty);

router.get("/owner-properties",auth,authorizeRoles('owner'), propertyController.getOwnerProperties);
router.get("/", propertyController.getAllProperties);

router.put("/:id",auth,propertyController.updateProperty);
router.delete("/:id",auth,propertyController.deleteProperties);

// transfer ownership
router.put('/transfer/:id',auth,propertyController.updatePropertyOwnership)
module.exports = router;

