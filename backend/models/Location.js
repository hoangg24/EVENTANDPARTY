import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên địa điểm là bắt buộc'],
      trim: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ là bắt buộc'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Thành phố là bắt buộc'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Quốc gia là bắt buộc'],
      trim: true,
    },
  },
  { timestamps: true } 
);

export default mongoose.model('Location', LocationSchema);