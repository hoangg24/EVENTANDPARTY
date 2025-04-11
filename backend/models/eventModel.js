import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    date: {
        type: Date,
        required: true,
        validate: {
          validator: function (value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // loại bỏ giờ phút để so sánh chính xác theo ngày
            return value >= today;
          },
          message: "Ngày phải từ hôm nay trở đi!",
        },
      },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, trim: true }, // New description field
    image: { type: String, trim: true }, // New image field
    services: {
        type: [
            {
                service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
                quantity: { type: Number, default: 0, min: 0 },
                description: { type: String },
            },
        ],
        default: [],
    },
    createdAt: { type: Date, default: Date.now },
    vote: { type: Number, default: 0, min: 0 },
    isPublic: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model('Event', eventSchema);