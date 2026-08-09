const mongoose = require('mongoose');

const connectDB = async () => {
    const configuredUri = process.env.MONGO_URI?.trim();
    const mongoUri = configuredUri?.replace(/^(['"])(.*)\1$/, '$2');

    if (!mongoUri || !/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
        throw new Error(
            'MONGO_URI must contain only a MongoDB connection string beginning with mongodb:// or mongodb+srv://'
        );
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MONGO DB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;
