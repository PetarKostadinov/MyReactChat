const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log('Invalid data passed into request!');
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    try {
        const chat = await Chat.findById(chatId).select('users');
        if (!chat) {
            res.status(404);
            throw new Error('Chat not found');
        }
        if (!chat.users.some((userId) => userId.equals(req.user._id))) {
            res.status(403);
            throw new Error('Not authorized to send messages to this chat');
        }

        var message = await Message.create(newMessage);

        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        });

        res.json(message);

    } catch (error) {
        if (res.statusCode === 200) res.status(400);
        throw new Error(error.message);
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId).select('users');
        if (!chat) {
            res.status(404);
            throw new Error('Chat not found');
        }
        if (!chat.users.some((userId) => userId.equals(req.user._id))) {
            res.status(403);
            throw new Error('Not authorized to view messages in this chat');
        }

        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');

        res.json(messages);

    } catch (error) {
        if (res.statusCode === 200) res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage, allMessages };
