const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [
        {
        book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, default: 1 },
        priceAtPurchase: { type: Number, required: true }
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true 
    },

    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Bank Transfer', 'E-Wallet']
    },
    status: { 
        type: String, 
        required: true,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    }

}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);