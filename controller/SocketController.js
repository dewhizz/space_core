// controllers/socketController.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);module.exports = (io) => {
  // Listen for new socket connections
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    /**
     * Join a specific room (usually by user ID)
     * This allows targeting messages to individual users
     */
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    /**
     * When a user creates a new inquiry,
     * notify the property owner in real-time
     */
    socket.on("newInquiry", (data) => {
      const { ownerId, inquiry } = data;
      io.to(ownerId).emit("inquiryReceived", inquiry);
    });

    /**
     * When the owner updates the inquiry status (approved/rejected),
     * notify the user who made the inquiry
     */
    socket.on("inquiryStatusUpdate", (data) => {
      const { userId, inquiry } = data;
      io.to(userId).emit("inquiryStatusChanged", inquiry);
    });

    /**
     * Real-time messaging between user and owner
     * Both sender and receiver get the message instantly
     */
    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text } = data;

      const message = {
        senderId,
        text,
        timestamp: new Date(),
      };

      // Emit message to both participants
      io.to(senderId).emit("receiveMessage", message);
      io.to(receiverId).emit("receiveMessage", message);
    });

    /**
     * When a user sends a booking request,
     * notify the property owner
     */
    socket.on("bookingRequest", (data) => {
      const { ownerId, booking } = data;
      io.to(ownerId).emit("bookingRequested", booking);
    });

    /**
     * When a booking is confirmed,
     * notify the user with the agreement link
     */
    socket.on("bookingConfirmed", (data) => {
      const { userId, agreementUrl } = data;
      io.to(userId).emit("bookingConfirmed", { agreementUrl });
    });

    /**
     * Handle socket disconnection
     */
    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });
};
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("newInquiry", (data) => {
      io.to(data.ownerId).emit("inquiryReceived", data);
    });

    socket.on("inquiryStatusUpdate", (data) => {
      io.to(data.userId).emit("inquiryStatusChanged", data);
    });

    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text } = data;
      const message = {
        senderId,
        text,
        timestamp: new Date(),
      };

      io.to(senderId).emit("receiveMessage", message);
      io.to(receiverId).emit("receiveMessage", message);
    });

    socket.on("bookingRequest", (data) => {
      io.to(data.ownerId).emit("bookingRequested", data);
    });

    socket.on("bookingConfirmed", (data) => {
      io.to(data.userId).emit("bookingConfirmed", {
        agreementUrl: data.agreementUrl,
      });
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });
};