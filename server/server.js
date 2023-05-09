const express = require("express");
const dotenv = require('dotenv');
const { chats } = require("./data");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes')

dotenv.config();
connectDB();
const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is Runing Successfully !');
});

app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server Started on PORT ${PORT}`));