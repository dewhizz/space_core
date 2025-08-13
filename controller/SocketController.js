// controllers/socketController.js

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
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