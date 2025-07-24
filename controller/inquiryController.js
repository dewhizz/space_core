const { Inquiry, Property, User } = require("../model/SpaceDB");

// add inquiry
// validate the existence of the user and property
exports.addInquiry = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { property, message } = req.body;

    console.log(userId);
    console.log(req.body);

    // confirm existence of the property
    const existProperty = await Property.findById(property);
    if (!existProperty)
      return res.status(404).json({ message: "Property not found" });

    const newInquiry = new Inquiry({
      user: userId,
      property,
      message,
    });
    await newInquiry.save();
    res
      .status(201)
      .json({ message: "Inquiry created successfully", newInquiry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all inquires
exports.getAllInquiries = async (req, res) => {
  try {
    const inquires = await Inquiry.find()
      .populate("property")
      .populate("user", "name email phone");
    console.log("inq", inquires);
    res.status(200).json(inquires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fetch one inquiry
exports.getOneById = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    // console.log(req.params.id)
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update
exports.updateInquiry = async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInquiry)
      return res.status(404).json({ message: "Inquiry not found" });
    res.status(201).json(updatedInquiry);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const deleteInquiry = await Inquiry.findByIdAndDelete(req.params.id);
    console.log("inq", deleteInquiry);
    if (!deleteInquiry)
      return res.status(404).json({ message: "inquiry not found" });
    res.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// respond to an inquiry
exports.respondToInquiry = async (req, res) => {
  try {
    const ownerId = req.user.userId;
    const inquiryId = req.params.id;
    const { response } = req.body;

    const inquiry = await Inquiry.findById(inquiryId).populate("property");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Confirm the current user is the property owner
    if (inquiry.property.owner.toString() !== ownerId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to respond to this inquiry" });
    }

    // Update the inquiry with a response
    inquiry.response = response;
    await inquiry.save();

    res.status(200).json({
      message: "Response sent successfully",
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
