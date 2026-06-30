const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    synopsis: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    coverImage: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { 
        type: String, 
        required: true,
        enum: [
            'Fiction', 
            'Non-Fiction', 
            'Self-Development', 
            'Technology & Science', 
            'Comic & Graphic Novel', 
            'Biography & History', 
            'Children & Young Adult', 
            'Textbook & Education'
        ]
    },
    salesCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema);