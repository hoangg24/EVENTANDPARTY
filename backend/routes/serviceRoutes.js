import express from 'express';
import serviceController from '../controllers/serviceController.js';

const router = express.Router();

router.get("/", serviceController.getAllServices); // Lấy danh sách dịch vụ
router.get("/:id", serviceController.getServiceById);
router.post("/create", serviceController.createService); // Tạo dịch vụ mới
router.put("/:id", serviceController.updateService); // Cập nhật dịch vụ
router.delete("/:id", serviceController.deleteService); // Xóa dịch vụ


export default router;
