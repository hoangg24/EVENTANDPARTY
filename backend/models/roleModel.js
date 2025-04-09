import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ví dụ: 'admin', 'user', 'organizer'
  description: { type: String }, // mô tả role (tùy chọn)
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
