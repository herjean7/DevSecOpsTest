const mongoose = require('mongoose');

const db = process.env.MONGO_URI;

const connectDB = async () => {
    mongoose.set('strictQuery', false);

    const conn = await mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
}

module.exports = connectDB;