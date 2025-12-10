const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
            quantity: { type: Number, default: 1 },
        }
    ]
}, { timestamps: true });

module.exports = mongoose.models.Cart || mongoose.model("Cart", CartSchema);
