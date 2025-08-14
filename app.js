const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// middleware
const app = express();
app.use(express.json());
app.use(cors());

// static file accessibility
app.use('/uploads', express.static('uploads'));

// login/register routes
const userAuth = require('./routes/loginRoutes');
app.use('/user/Auth', userAuth);

// properties routes
const properties = require('./routes/propertyRoute');
app.use('/api/properties', properties);

// inquiry routes
const inquiries = require('./routes/inquiryRoute');
app.use('/api/inquiries', inquiries);

// booking routes
const booking = require('./routes/bookingRoute');
app.use('/api/booking', booking);

// ownerDash routes
const owner = require('./routes/ownerRoute');
app.use('/api/owner', owner);

// userDash routes
const userDash = require('./routes/userDashRoute');
app.use('/api/userDash', userDash);

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket controller
require('./controller/SocketController')(io);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch(err => console.log(` MongoDB connection error: ${err}`));

// Start server
const PORT = 3002;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});