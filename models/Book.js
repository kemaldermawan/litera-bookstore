const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    synopsis: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, required: true, enum: ['Fiksi', 'Non-Fiksi', 'Komik', 'Biografi', 'Anak-Anak', 'Edukasi']},
    salesCount: { type: Number, default: 0},
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review'}]
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);

const ReviewSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);

const OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, default: 1 }
        }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Completed' }
}, { timestamps: true });

module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema);