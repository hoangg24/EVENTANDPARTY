import express from 'express';
import bugLogController from '../controllers/bugLogController.js';
import {  adminMiddleware, authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, bugLogController.getAllLogs);
router.delete('/:id', authMiddleware, adminMiddleware, bugLogController.deleteLog);

export default router;