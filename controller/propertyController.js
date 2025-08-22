const { Property, User } = require("../model/SpaceDB");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Middleware factory for photo upload
exports.uploadPropertyPhoto = (fieldName) => {
  return upload.single(fieldName);
};

// Add Property
exports.addProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    const owner = req.user.userId;

    let photo = "";
    if (req.file) {
      photo = req.file.path.replace(/\\/g, "/");
    }

    const savedProperty = new Property({
      ...propertyData,
      owner,
      photo,
    });

    await savedProperty.save();

    const user = await User.findById(owner);
    if (user && user.role !== "owner") {
      user.role = "owner";
      await user.save();
    }

    res.status(201).json({
      message: "Property added successfully",
      savedProperty,
      updatedUser: user,
    });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const propertyId = req.params.id;
    const updateData = req.body;

    if (!ownerId) return res.status(401).json({ message: "User not found" });

    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) return res.status(404).json({ message: "Property not found" });

    if (existingProperty.owner.toString() !== ownerId)
      return res.status(403).json({ message: "Unauthorized" });

    if (req.file) {
      if (existingProperty.photo) {
        fs.unlink(existingProperty.photo, (err) => {
          if (err) console.error("Failed to delete old photo:", err);
        });
      }

      updateData.photo = req.file.path.replace(/\\/g, "/");
    }

    const updatedProperty = await Property.findByIdAndUpdate(propertyId, updateData, { new: true });

    res.status(200).json({
      message: "Property updated successfully",
      updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete Property
exports.deleteProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property Not Found" });

    if (property.owner.toString() !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized Action" });

    if (property.photo) {
      fs.unlink(property.photo, (err) => {
        if (err) console.error("Failed to delete photo:", err);
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Transfer Property Ownership
exports.updatePropertyOwnership = async (req, res) => {
  try {
    const currentOwner = req.user.userId;
    const propertyId = req.params.id;
    const { newOwnerId } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property Not Found" });

    if (property.owner.toString() !== currentOwner)
      return res.status(403).json({ message: "Unauthorized transfer request" });

    const newOwner = await User.findById(newOwnerId);
    if (!newOwner) return res.status(404).json({ message: "User Not found please sign up" });

    property.owner = newOwner._id;
    await property.save();

    res.status(200).json({ message: "Ownership transfer successful", property });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("owner", "name email phone");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Property by ID
exports.getPropertiesById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Properties Owned by Logged-in User
exports.getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

    const properties = await Property.find({ owner: ownerId }).populate("owner", "name email phone");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};