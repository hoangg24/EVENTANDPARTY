import Invoice from '../models/invoiceModel.js';
import Event from '../models/eventModel.js';
import mongoose from 'mongoose';

const invoiceController = {
    createInvoice: async (req, res) => {
        try {
            const { eventId, status = 'Pending' } = req.body; // Nhận trạng thái nếu có
            const userId = req.user.id;
            // Tìm sự kiện và populate danh sách dịch vụ
            const event = await Event.findById(eventId).populate('services.service');
            if (!event) {
                return res.status(404).json({ message: 'Không tìm thấy sự kiện!' });
            }
    
            // Kiểm tra nếu không có dịch vụ
            if (!event.services || event.services.length === 0) {
                return res.status(400).json({ message: 'Sự kiện không có dịch vụ nào để tạo hóa đơn!' });
            }
    
            // Tạo hóa đơn từ dữ liệu sự kiện
            const services = event.services.map((service) => ({
                service: service.service._id,
                name: service.service.name,
                price: service.service.price,
                quantity: service.quantity,

            }));
    
            const totalAmount = services.reduce(
                (sum, service) => sum + service.price * service.quantity,
                0
            );
    
            const newInvoice = new Invoice({
                event: event._id,
                services,
                totalAmount,
                status, // Gán trạng thái
                createdBy: userId,
            });
    
            await newInvoice.save();
    
            res.status(201).json({
                message: 'Hóa đơn đã được tạo thành công!',
                invoice: newInvoice,
            });
        } catch (error) {
            console.error('Lỗi khi tạo hóa đơn:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi tạo hóa đơn!' });
        }
    },
    

    // Lấy danh sách hóa đơn
    getAllInvoices: async (req, res) => {
        try {
            const userRole = req.user.role; // Vai trò của người dùng từ middleware xác thực
            const userId = req.user.id; // ID người dùng từ token xác thực
    
            let invoices;
            if (userRole === 'admin') {
                // Admin: Trả về tất cả hóa đơn
                invoices = await Invoice.find()
                    .populate('event', 'name date location') // Populate thông tin sự kiện
                    .populate('services.service', 'name price'); // Populate thông tin dịch vụ
            } else {
                // Người dùng thường: Chỉ trả về hóa đơn của họ
                invoices = await Invoice.find({ createdBy: userId })
                    .populate('event', 'name date location')
                    .populate('services.service', 'name price');
            }
    
            res.status(200).json(invoices);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách hóa đơn:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn!' });
        }
    },

    // Lấy chi tiết hóa đơn theo ID
    getInvoiceById: async (req, res) => {
        try {
            const { id } = req.params;
            const userRole = req.user.role; // Vai trò người dùng
            const userId = req.user.id; // ID người dùng
    
            const invoice = await Invoice.findById(id)
                .populate('event', 'name date location')
                .populate('services.service', 'name price');
    
            if (!invoice) {
                return res.status(404).json({ message: 'Hóa đơn không tồn tại!' });
            }
    
            // Kiểm tra quyền truy cập
            if (userRole !== 'admin' && invoice.createdBy.toString() !== userId) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập hóa đơn này!' });
            }
    
            res.status(200).json(invoice);
        } catch (error) {
            console.error('Lỗi khi lấy hóa đơn:', error);
            res.status(500).json({ message: 'Lỗi khi lấy hóa đơn!' });
        }
    },
    deleteInvoiceById: async (req, res) => {
        try {
            const { invoiceId } = req.params;
            const userRole = req.user.role;
    
            // Kiểm tra quyền truy cập: chỉ admin mới được phép xóa
            if (userRole !== 'admin') {
                return res.status(403).json({ message: 'Bạn không có quyền xóa hóa đơn!' });
            }
    
            const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);
    
            if (!deletedInvoice) {
                return res.status(404).json({ message: 'Không tìm thấy hóa đơn để xóa!' });
            }
    
            res.status(200).json({ message: 'Xóa hóa đơn thành công!' });
        } catch (error) {
            console.error('Lỗi khi xóa hóa đơn:', error);
            res.status(500).json({ message: 'Lỗi khi xóa hóa đơn!' });
        }
    },
    updateInvoiceById: async (req, res) => {
        try {
            const { invoiceId } = req.params;
            const { status } = req.body; // Nhận trạng thái từ client
    
            if (!['Pending', 'Paid', 'Canceled'].includes(status)) {
                return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
            }
    
            const updatedInvoice = await Invoice.findByIdAndUpdate(
                invoiceId,
                { status }, // Cập nhật trạng thái
                { new: true }
            )
                .populate('event', 'name date location')
                .populate('services.service', 'name price');
    
            if (!updatedInvoice) {
                return res.status(404).json({ message: 'Không tìm thấy hóa đơn để cập nhật!' });
            }
    
            res.status(200).json({ message: 'Cập nhật trạng thái hóa đơn thành công!', invoice: updatedInvoice });
        } catch (error) {
            console.error('Lỗi khi cập nhật hóa đơn:', error);
            res.status(500).json({ message: 'Lỗi khi cập nhật hóa đơn!' });
        }
    }
};

export default invoiceController;
