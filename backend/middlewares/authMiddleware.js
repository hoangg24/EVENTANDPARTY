// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

// Middleware xác thực token và lưu thông tin user vào request
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu thông tin người dùng
        next(); // Tiếp tục xử lý nếu xác thực thành công
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Quyền truy cập bị từ chối. Chỉ admin mới có thể truy cập.' });
    }
    next(); // Tiếp tục xử lý nếu là admin
};

export { authMiddleware, adminMiddleware };
