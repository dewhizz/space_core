const mongoose=require('mongoose')
const Schema=mongoose.Schema

// define the user schema
const userSchema=new Schema({
    name:{type:String},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phone:{type:Number},
    role:{type:String},
    idNumber:{type:String,unique:true},
    isActive:Boolean
},{timestamps:true})

// properties
const propertySchema = new Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plotNumber: { type: String, required: true, unique: true },
    title:{type:String},
    description: { type: String },
    propertyType: {
      type: String,
      enum: ["apartment", "bungalow", "mansion", "office", "shop"],
    },
    location: {type:String},
    rentAmount: String,
    depositAmount: String,
    photo: String,
    isAvailable: Boolean,
    status: {
      type: String,
      enum: ["rented", "active", "inactive"],
    },
    viewsCount: Number,
  },
  { timestamps: true }
);

// inquiries
const inquirySchema=new Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    message:{type:String},
    status:{type:String,enum:['pending,viewing_scheduled,responded,closed']},
    viewingDate:{type:Date}
},{timestamps:true})

// bookings
const bookingSchema=new Schema({
    property:{type:mongoose.Schema.Types.ObjectId,ref:'Property'},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    startDate:{type:Date},
    endDate:{type:Date},
    leaseAgreementUrl:{type:String}
},{timestamps:true})

// exports
const User = mongoose.model('User',userSchema)
const Property = mongoose.model("Property", propertySchema);
const Inquiry = mongoose.model("Inquiry",inquirySchema);
const Booking = mongoose.model("Booking",bookingSchema);

module.exports={User,Property,Inquiry,Booking}