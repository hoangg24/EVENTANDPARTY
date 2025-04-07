import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true } // Thêm thông tin thời gian tạo và cập nhật
);

export default mongoose.model('Category', CategorySchema);