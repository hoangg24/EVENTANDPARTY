import express from 'express';
import invoiceController from '../controllers/invoiceController.js';
import { authMiddleware,adminMiddleware  } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.post('/create',authMiddleware, invoiceController.createInvoice); // Tạo hóa đơn
router.get('/', authMiddleware, invoiceController.getAllInvoices); // Lấy tất cả hóa đơn
router.get('/:id', authMiddleware,invoiceController.getInvoiceById); // Lấy chi tiết hóa đơn
router.delete('/:invoiceId', authMiddleware,adminMiddleware, invoiceController.deleteInvoiceById);
router.put('/:invoiceId', invoiceController.updateInvoiceById);
export default router;
