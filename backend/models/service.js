import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Tên dịch vụ
  description: { type: String }, // Mô tả dịch vụ
  quantity: { type: Number, required: true, min: 0 }, // Số lượng dịch vụ
  price: { type: Number, required: true }, // Giá dịch vụ
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
});

export default mongoose.model('Service', ServiceSchema);