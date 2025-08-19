const { Inquiry, Property, User } = require("../model/SpaceDB");

// Inject Socket.IO instance (optional pattern)
let io;
exports.injectSocket = (socketInstance) => {
  io = socketInstance;
};

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

    // Notify owner in real-time
    if (io) {
      io.to(existProperty.owner.toString()).emit("inquiryReceived", newInquiry);
    }

    res.status(201).json({ message: "Inquiry created successfully", inquiry: newInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to Inquiry (Owner Only)
exports.respondToInquiry = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const inquiryId = req.params.id;
    const { response, status } = req.body;

    const inquiry = await Inquiry.findById(inquiryId).populate("property");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (inquiry.property.owner.toString() !== ownerId) {
      return res.status(403).json({ message: "Unauthorized to respond to this inquiry" });
    }

    inquiry.response = response;
    inquiry.status = status || inquiry.status;
    await inquiry.save();

    // Notify user in real-time
    if (io) {
      io.to(inquiry.user.toString()).emit("inquiryStatusChanged", inquiry);
    }

    res.status(200).json({ message: "Response sent successfully", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Inquiry 
exports.updateInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("property");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    const isUser = inquiry.user.toString() === req.user.userId;
    const isOwner = inquiry.property.owner.toString() === req.user.userId;

    if (!isUser && !isOwner) {
      return res.status(403).json({ message: "Unauthorized to update this inquiry" });
    }

    // Define allowed fields based on role
    const allowedUpdates = isUser
      ? ["message"] // users can update their message
      : ["status", "response"]; // owners can update status and response

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        inquiry[field] = req.body[field];
      }
    });

    await inquiry.save();
    res.status(200).json({ message: "Inquiry updated", inquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Inquiry (User Only)
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

// Get inquiries made by the logged-in user (with optional status filter)
exports.getUserInquiries = async (req, res) => {
  try {
    const user = req.user.userId;
    const { status } = req.query;

    const filter = { user };
    if (status) filter.status = status;

    const inquiries = await Inquiry.find(filter)
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
    const owner = req.user.userId;
    const { status } = req.query;

    const properties = await Property.find({ owner }).select("_id");
    const filter = { property: { $in: properties } };
    if (status) filter.status = status;

    const inquiries = await Inquiry.find(filter)
      .populate("user", "name email")
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a message to an inquiry (chat thread)
exports.addMessageToInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate("property");

    if (!inquiry || inquiry.status !== "approved") {
      return res.status(403).json({ message: "Chat not allowed" });
    }

    const message = {
      sender: req.user.userId,
      text: req.body.text,
      timestamp: new Date(),
    };

    inquiry.messages.push(message);
    await inquiry.save();

    // Emit to both user and owner
    if (io) {
      io.to(inquiry.user.toString()).emit("receiveMessage", message);
      io.to(inquiry.property.owner.toString()).emit("receiveMessage", message);
    }

    res.status(200).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};