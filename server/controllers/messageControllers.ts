const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const { isChatMember } = require('../domain/chatPermissions');


const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400).send({ message: 'Message content and chat ID are required' });
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };

    const chat = await Chat.findById(chatId).select('users');
    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }
    if (!isChatMember(chat.users, req.user)) {
        res.status(403);
        throw new Error('Not authorized to send messages to this chat');
    }

    let message = await Message.create(newMessage);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await User.populate(message, {
        path: 'chat.users',
        select: 'name pic email'
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json(message);
});

const allMessages = asyncHandler(async (req, res) => {
    const chat = await Chat.findById(req.params.chatId).select('users');
    if (!chat) {
        res.status(404);
        throw new Error('Chat not found');
    }
    if (!isChatMember(chat.users, req.user)) {
        res.status(403);
        throw new Error('Not authorized to view messages in this chat');
    }

    const messages = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'name pic email')
        .populate('chat');

    res.json(messages);
});

module.exports = { sendMessage, allMessages };
