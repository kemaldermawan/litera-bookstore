const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtPurchase: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        // PERBAIKAN: Ekspansi nilai enum agar mencakup seluruh opsi pembayaran dummy Indonesia
        enum: ['Cash', 'Bank Transfer', 'GoPay', 'OVO', 'Dana', 'BCA Virtual Account', 'Mandiri Virtual Account', 'COD']
    },
    pickupDetails: {
        pickupStore: { type: String, default: 'Litera Main HQ Branch' },
        reservationExpiry: { type: Date }
    },
    status: {
        type: String,
        required: true,
        // PERBAIKAN: Ekspansi nilai enum status agar adaptif terhadap metode pembayaran e-wallet dan pengiriman kurir
        enum: ['Pending Pickup', 'Pending Payment', 'Pending Delivery', 'Completed', 'Cancelled'],
        default: 'Pending Payment'
    }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);