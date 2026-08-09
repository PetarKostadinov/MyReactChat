const express = require("express");
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const jwt = require('jsonwebtoken');
const Chat = require('./models/chatModel');

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
    : ["http://localhost:3000", "https://mychat-2ce41.web.app"];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is Runing Successfully !');
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

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
    console.log('connected to socket.io');
    socket.join(connectedUserId);

    socket.on('setup', () => {
        socket.emit('connected');
    });

    socket.on('join chat', async (room) => {
        const chat = await Chat.exists({ _id: room, users: connectedUserId });
        if (chat) {
            socket.join(room);
            console.log('User Joined The Room: ' + room);
        }
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');
        if (String(newMessageRecieved.sender?._id) !== connectedUserId) return;
        if (!chat.users.some((user) => String(user._id) === connectedUserId)) return;
        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        })
    });

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
        socket.leave(connectedUserId);
    })
});
