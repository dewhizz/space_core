const mongoose = require('mongoose')
const Schema = mongoose.Schema

// define the user schema

const userSchema = new Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number },
    role: { type: String, enum: ["user", "owner"], default: "user" },
    photo: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);
// properties
const propertySchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plotNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    propertyType: {
      type: String,
      enum: ["apartment", "bungalow", "mansion", "office", "shop"],
      
    },
    location: { type: String },
    rentAmount: { type: String },
    depositAmount: { type: String },
    photos: { type: String },
    isAvailable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["rented", "active", "inactive"],
      default: "active",
    },
    viewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);



const messageSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  timestamp: { type: Date, default: Date.now },
});

const inquirySchema = new Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  initialMessage: String, // first inquiry message
  response: String,       // owner's reply
  status: {
    type: String,
    enum: ["pending", "approved", "declined"],
    default: "pending",
  },
  messages: [messageSchema], // real-time chat history
}, { timestamps: true });


// bookings
const bookingSchema = new Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Inquiry" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  startDate: { type: String },
  endDate: { type: String },
  leaseAgreementUrl: { type: String }
}, { timestamps: true })

// exports
const User = mongoose.model('User', userSchema)
const Property = mongoose.model("Property", propertySchema);
const Inquiry = mongoose.model("Inquiry", inquirySchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { User, Property, Inquiry, Booking }