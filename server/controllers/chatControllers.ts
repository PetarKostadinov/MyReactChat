const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).send({ message: "User ID is required" });
    }
    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send({ message: "Invalid user ID" });
    }
    if (String(userId) === String(req.user._id)) {
        return res.status(400).send({ message: "You cannot create a chat with yourself" });
    }
    if (!await User.exists({ _id: userId })) {
        return res.status(404).send({ message: "User not found" });
    }

    let chat = await Chat.findOne({
        isGroupChat: false,
        users: { $all: [req.user._id, userId], $size: 2 },
    })
        .populate("users", "-password")
        .populate("latestMessage");

    chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (chat) {
        return res.json(chat);
    }

    const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findById(createdChat._id).populate("users", "-password");
    res.status(201).json(fullChat);
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = asyncHandler(async (req, res) => {
    let results = await Chat.find({ users: req.user._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
    results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    res.status(200).json(results);
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: 'All fields are required!' });
    }

    let users;
    try {
        users = [...new Set(JSON.parse(req.body.users).map(String))];
    } catch {
        return res.status(400).send({ message: 'Users must be a valid JSON array' });
    }

    if (users.length < 2) {
        return res.status(400).send({ message: 'At least 2 other users are required to form a group chat' });
    }

    users.push(String(req.user._id));

    const groupChat = await Chat.create({
        chatName: req.body.name.trim(),
        users,
        isGroupChat: true,
        groupAdmin: req.user
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    res.status(201).json(fullGroupChat);
});

const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatName?.trim()) {
        return res.status(400).send({ message: 'Chat name is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error('Chat Not Found');
    }
    if (String(chat.groupAdmin) !== String(req.user._id)) {
        res.status(403);
        throw new Error('Only the group admin can rename this chat');
    }

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName: chatName.trim() },
        { new: true }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    if (!updatedChat) {
        res.status(404);
        throw new Error('Chat Not Found');
    }
    res.json(updatedChat);
});


const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error('Chat Not Found!');
    }
    if (String(chat.groupAdmin) !== String(req.user._id)) {
        res.status(403);
        throw new Error('Only the group admin can add users');
    }
    if (!await User.exists({ _id: userId })) {
        res.status(404);
        throw new Error('User Not Found!');
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $addToSet: { users: userId }
        },
        { new: true }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    if (!added) {
        res.status(404);
        throw new Error('Chat Not Found!');
    }
    res.json(added);
})

const removeFromGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        res.status(404);
        throw new Error('Chat Not Found!');
    }
    const isAdmin = String(chat.groupAdmin) === String(req.user._id);
    const isLeaving = String(userId) === String(req.user._id);
    if (!isAdmin && !isLeaving) {
        res.status(403);
        throw new Error('Only the group admin can remove other users');
    }

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId }
        },
        { new: true }
    )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

    if (!removed) {
        res.status(404);
        throw new Error('Chat Not Found!');
    }
    res.json(removed);
})


module.exports = { accessChat, fetchChats, createGroupChat, renameGroupChat, addToGroup, removeFromGroupChat };
