const dotenv = require('dotenv');
const connectDB = require("./config/db");
const { createApp, getAllowedOrigins } = require('./app');
const jwt = require('jsonwebtoken');
const Chat = require('./models/chatModel');

dotenv.config();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const allowedOrigins = getAllowedOrigins();
    const app = createApp(allowedOrigins);
    const server = app.listen(PORT, () => console.log(`Server Started on PORT ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {

        origin: allowedOrigins
    }
});

io.use((socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication required'));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.userId = String(decoded.id);
        next();
    } catch {
        next(new Error('Invalid authentication token'));
    }
});

io.on('connection', (socket) => {
    const connectedUserId = socket.data.userId;
    socket.join(connectedUserId);

    socket.on('setup', () => {
        socket.emit('connected');
    });

    socket.on('join chat', async (room) => {
        const chat = await Chat.exists({ _id: room, users: connectedUserId });
        if (chat) {
            socket.join(room);
        }
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;

        if (!chat.users) return;
        if (String(newMessageRecieved.sender?._id) !== connectedUserId) return;
        if (!chat.users.some((user) => String(user._id) === connectedUserId)) return;
        chat.users.forEach(user => {
            if (String(user._id) === String(newMessageRecieved.sender._id)) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        })
    });

    socket.on('disconnect', () => {
        socket.leave(connectedUserId);
    })
});

};

startServer().catch((error) => {
    console.error(`Failed to start server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
});
