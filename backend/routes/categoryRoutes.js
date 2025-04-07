import express from 'express';
import categoryController from '../controllers/categoryController.js';

const router = express.Router();

// Lấy tất cả danh mục
router.get('/', categoryController.getAllCategories);

// Thêm danh mục mới
router.post('/', categoryController.createCategory);

// Cập nhật danh mục
router.put('/:id', categoryController.updateCategory);

// Xóa danh mục
router.delete('/:id', categoryController.deleteCategory);

export default router;
