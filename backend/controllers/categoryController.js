import Category from '../models/Category.js';
import mongoose from 'mongoose';
import Event from '../models/eventModel.js';

const categoryController={
// Lấy tất cả danh mục
    getAllCategories : async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }); // Sắp xếp giảm dần theo thời gian
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy danh mục' });
  }
},

// Tạo danh mục mới
    createCategory : async (req, res) => {
  const { name } = req.body;

  try {
    // Kiểm tra xem danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Danh mục đã tồn tại' });
    }

    const category = new Category({ name });
    await category.save();
    res.status(201).json({ message: 'Tạo danh mục thành công', category });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi tạo danh mục' });
  }
},

// Cập nhật danh mục
    updateCategory : async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    category.name = name;
    await category.save();

    res.status(200).json({ message: 'Cập nhật danh mục thành công', category });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục' });
  }
},

// Xóa danh mục
    deleteCategory: async (req, res) => {
    const { id } = req.params;
  
    // Kiểm tra ID có hợp lệ không
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ message: 'ID danh mục không hợp lệ' });
    // }
  
    try {
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      }
  
      // Kiểm tra nếu danh mục đang được tham chiếu
      const relatedEvents = await Event.find({ category: id });
      if (relatedEvents.length > 0) {
        return res.status(400).json({
          message: 'Không thể xóa danh mục vì đang được sử dụng trong các sự kiện khác',
        });
      }
  
      // Xóa danh mục
      await category.deleteOne();
      res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
      console.error('Error while deleting category:', error.message);
      res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
    }
  }
}
export default categoryController;