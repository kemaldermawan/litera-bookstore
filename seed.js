const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');

dotenv.config();

/**
 * Establish a secure connection to the MongoDB deployment instance
 * utilizing environmental URI parameters.
 */
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('Environmental parameter MONGO_URI is not defined inside the configurations.');
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected successfully for inventory seeding operations...');
    } catch (err) {
        console.error('❌ Database connection alignment failed:', err.message);
        process.exit(1);
    }
};

/**
 * Clear existing book collections and seed internationalized inventory assets.
 */
const seedData = async () => {
    await connectDB();
    try {
        // Purge historical records to maintain data consistency during deployments
        // await Book.deleteMany({});
        // console.log('🧹 Historical book collections wiped from the database.');

        // Compiled list of mock physical books localized into professional English structures
        const booksData = [

        ];

        // Mass block persistence insertion execution
        // await Book.insertMany(booksData);
        // console.log(`🎉 Success! Inserted ${booksData.length} internationalized dummy books into the inventory ledger.`);
        
    } catch (error) {
        console.error('❌ Error executing database seeding commands:', error);
    } finally {
        // Enforce safe structural database termination drops
        await mongoose.connection.close();
        console.log('🔌 Database connection stream safely closed.');
    }
};

seedData();