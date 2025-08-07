const { Inquiry, Property, User } = require("../model/SpaceDB");

// Add Inquiry
exports.addInquiry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { property, message } = req.body;

    const existProperty = await Property.findById(property);
    if (!existProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const newInquiry = new Inquiry({
      user: userId,
      property,
      message,
      status: "pending",
    });

    await newInquiry.save();
    res.status(201).json({ message: "Inquiry created successfully", inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Respond to Inquiry (Owner Only)
exports.respondToInquiry = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const inquiryId = req.params.id;
    const { response, status } = req.body;

    const inquiry = await Inquiry.findById(inquiryId)
    .populate("property");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.property.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Unauthorized to respond to this inquiry" });
    }

    inquiry.response = response;
    inquiry.status = status || inquiry.status; // preserve current status if not provided
    await inquiry.save();

    res.status(200).json({ message: "Response sent successfully", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("property", "title owner")
      .populate("user", "name email phone");

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get One Inquiry
exports.getOneById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate("property", "title owner")
      .populate("user", "name email phone");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Update Inquiry (User Only)
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to update this inquiry" });
    }

    const allowedUpdates = ["message"];
    allowedUpdates.forEach((field) => {
      if (req.body[field]) inquiry[field] = req.body[field];
    });

    await inquiry.save();
    res.status(200).json({ message: "Inquiry updated", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Delete Inquiry (User Only)
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized to delete this inquiry" });
    }

    await inquiry.deleteOne();
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiries made by the logged-in user
exports.getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.userId;
    const inquiries = await Inquiry.find({ user: userId })
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get inquiries for properties owned by the logged-in owner
exports.getOwnerInquiries = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const properties = await Property.find({ owner: ownerId }).select("_id");
    const inquiries = await Inquiry.find({ property: { $in: properties } })
      .populate("user", "name email")
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};