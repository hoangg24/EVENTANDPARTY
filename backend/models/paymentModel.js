import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true },
    paymentMethod: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed'], 
        default: 'Pending' 
    },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Payment', PaymentSchema);