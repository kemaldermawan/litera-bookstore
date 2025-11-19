const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    synopsis: { type: String, required: true },
    price: { type: Number, required: true },
    coverImage: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { 
        type: String, 
        required: true,
        enum: ['Fiksi', 'Non-Fiksi', 'Komik', 'Biografi', 'Anak-Anak', 'Edukasi']
    },
    salesCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);