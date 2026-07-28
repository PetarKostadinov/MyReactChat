# MyReactChat 💬

A real-time, responsive chat application built with React and Socket.IO, demonstrating modern web development practices for real-time bidirectional communication between clients and servers.

---

## ✨ Features

- **Real-Time Messaging** - Instant message delivery using Socket.IO
- **User Authentication** - Secure signup and login with JWT
- **Group Chat Support** - Create and manage group conversations
- **User Presence** - See online/offline status of users
- **Profile Pictures** - Upload and display user avatars via Cloudflare
- **Chat Management** - Update group names, add/remove members, leave groups
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Message Notifications** - Bell icon with notification system
- **Chakra UI Components** - Modern, accessible UI framework

---

## 🛠 Tech Stack

**Frontend:**
- React 18 (UI library)
- Socket.IO Client (real-time communication)
- Chakra UI (component library)
- React Router (navigation)
- Axios (API communication)
- Framer Motion (animations)

**Backend:**
- Node.js + Express (server)
- Socket.IO (real-time WebSocket communication)
- MongoDB (database)
- Mongoose (ODM)
- JWT (authentication)
- Bcryptjs (password hashing)
- Cloudinary (image hosting)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB local or cloud instance
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PetarKostadinov/MyReactChat.git
   cd MyReactChat
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Create .env file with:
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   
   # Start the server
   npm start
   # or with auto-reload:
   nodemon server/server.js
   ```

3. **Frontend Setup**
   ```bash
   cd client
   
   # Install dependencies
   npm install
   
   # Add proxy to package.json:
   # "proxy": "http://127.0.0.1:5000"
   
   # Start the React app
   npm start
   ```

4. **Open in Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
MyReactChat/
├── server/
│   ├── models/
│   │   ├── chatModel.js        # Chat schema
│   │   ├── messageModel.js     # Message schema
│   │   └── userModel.js        # User schema
│   ├── routes/                 # API endpoints
│   ├── controllers/            # Business logic
│   ├── middleware/             # Auth middleware
│   └── server.js               # Server entry point
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/           # Login/Register forms
│   │   │   ├── ChatBox/        # Chat interface
│   │   │   ├── MyChats/        # Chat list
│   │   │   ├── Header/         # Navigation
│   │   │   └── Notifications/  # Notification bell
│   │   ├── pages/              # Page components
│   │   ├── styles/             # CSS files
│   │   └── App.js              # Main component
│   └── package.json
├── package.json
└── README.md
```

---

## 🔑 Key Features Breakdown

### Authentication
- User registration with profile picture upload
- Secure login with JWT token
- Password hashing with bcryptjs
- Protected routes and API endpoints

### Chat Management
- View all your chats in the sidebar
- Create one-on-one conversations
- Create group chats with multiple users
- Update group chat names
- Add/remove members from groups
- Leave group conversations

### Real-Time Messaging
- Send and receive messages instantly
- Socket.IO bidirectional communication
- Message persistence in MongoDB
- Notification system for new messages
- Online/offline user status

### User Experience
- Clean, modern UI with Chakra UI
- Responsive design for all screen sizes
- Smooth animations with Framer Motion
- Accessibility features built-in
- Intuitive navigation

---

## 💡 Learning Outcomes

This project demonstrates:

- **Real-Time Communication** - Socket.IO implementation for live messaging
- **Full-Stack Development** - Complete MERN stack application
- **Authentication & Security** - JWT tokens and password hashing
- **State Management** - Complex application state with React hooks
- **Database Design** - MongoDB schema relationships and queries
- **API Integration** - RESTful API design and consumption
- **File Upload** - Integrating third-party services (Cloudinary)
- **WebSocket Programming** - Bidirectional client-server communication

---

## 🎯 Future Enhancements

- [ ] Direct message encryption
- [ ] Message search functionality
- [ ] Message reactions/emojis
- [ ] Voice/video calling
- [ ] Message history pagination
- [ ] User typing indicators
- [ ] Message read receipts
- [ ] Cloud deployment (AWS/Heroku)
- [ ] Mobile app version
- [ ] Dark mode theme

---

## 📝 License

This project is open source and available under the MIT License.

---

**Built as part of JavaScript development training at Software University (SoftUni)**
