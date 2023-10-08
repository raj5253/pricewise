import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [
        {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    lowestPrice: { type: Number },
    highestPrice: { type: Number },
    averagePrice: { type: Number },
    discountRate: { type: Number },
    description: { type: String },
    category: { type: String },
    reviewsCount: { type: Number },
    isOutOfStock: { type: Boolean, default: false },
    users: [
        { email: { type: String, required: true } }
    ], default: [],
}, { timestamps: true }
)


const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
// const Product  = mongoose.model('Product', productSchema)

export default Product;
// string(with a small 's') denotes a primitive
// whereas String(with an uppercase 'S') denotes an object

// when I used string:
//  error: string' only refers to a type, but is being used as a value here.