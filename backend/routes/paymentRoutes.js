import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Route tạo giao dịch MoMo
router.post('/momo/create', paymentController.createMoMoPayment);

// Route xử lý thông báo từ MoMo
router.post('/momo/notify', paymentController.handleMoMoNotification);
router.get('/payments/status/:orderId', paymentController.getPaymentStatus);
export default router;
