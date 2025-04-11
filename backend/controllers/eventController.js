import Event from "../models/eventModel.js";
import Service from "../models/service.js";
import Invoice from "../models/invoiceModel.js";
import Category from "../models/Category.js";
import Location from "../models/Location.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eventController = {
  // Tạo sự kiện mới
  createEvent: async (req, res) => {
    try {
      const {
        name,
        date,
        category,
        location,
        description,
        services = [],
        isPublic,
      } = req.body;
      const userId = req.user.id;

      let imagePath = "";
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }

      // Kiểm tra danh mục
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
      }
      if (new Date(date) < new Date()) {
        return res.status(400).json({ message: "Ngày không được nằm trong quá khứ!" });
      }

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Danh mục không tồn tại!" });
      }

      // Kiểm tra danh sách dịch vụ nếu không rỗng
      let populatedServices = [];
      if (services.length > 0) {
        populatedServices = await Promise.all(
          services.map(async (s) => {
            if (!mongoose.Types.ObjectId.isValid(s.service)) {
              throw new Error(`ID dịch vụ không hợp lệ: ${s.service}`);
            }
            const serviceData = await Service.findById(s.service);
            if (!serviceData) {
              throw new Error(`Dịch vụ với ID ${s.service} không tồn tại.`);
            }
            return {
              service: s.service,
              quantity: s.quantity,
              price: serviceData.price,
            };
          })
        );
      }

      // Tạo sự kiện mới
      const newEvent = new Event({
        name,
        date,
        category,
        location,
        description,
        image: imagePath,
        services: populatedServices,
        isPublic,
        createdBy: userId,
      });
      const savedEvent = await newEvent.save();

      res
        .status(201)
        .json({ message: "Tạo sự kiện thành công!", event: savedEvent });
    } catch (error) {
      console.error("Lỗi khi tạo sự kiện:", error.message);
      res
        .status(500)
        .json({ message: "Lỗi khi tạo sự kiện!", error: error.message });
    }
  },

  // Lấy danh sách sự kiện
  getEvents: async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      let events;
      if (userRole === "admin") {
        // Admin xem tất cả sự kiện
        events = await Event.find()
          .populate("category", "name")
          .populate("location", "name")
          .populate("services.service", "name price");
      } else {
        // Người dùng thường chỉ xem công khai hoặc sự kiện họ tạo
        events = await Event.find({
          $or: [{ isPublic: true }, { createdBy: userId }],
        })
          .populate("category", "name")
          .populate("location", "name")
          .populate("services.service", "name price");
      }

      res.status(200).json(events);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sự kiện:", error.message);
      res.status(500).json({ message: "Lỗi khi lấy danh sách sự kiện!" });
    }
  },

  // Lấy sự kiện theo ID
  getEventById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID sự kiện không hợp lệ!" });
      }

      const event = await Event.findById(id)
        .populate("category", "name")
        .populate("location", "name")
        .populate("services.service", "name price description");

      if (!event) {
        return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
      }

      // Kiểm tra quyền truy cập
      if (
        !event.isPublic &&
        event.createdBy.toString() !== userId &&
        userRole !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xem sự kiện này!" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Lỗi khi lấy sự kiện:", error.message);
      res
        .status(500)
        .json({ message: "Lỗi khi lấy sự kiện!", error: error.message });
    }
  },

  // Cập nhật sự kiện
  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        isPublic,
        name,
        date,
        category,
        location,
        description,
        services = [],
      } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID sự kiện không hợp lệ!" });
      }
      if (date && new Date(date) < new Date()) {
        return res.status(400).json({ message: "Ngày không được nằm trong quá khứ!" });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Sự kiện không tồn tại!" });
      }

      // Kiểm tra quyền truy cập
      if (
        !event.isPublic &&
        event.createdBy.toString() !== userId &&
        userRole !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền cập nhật sự kiện này!" });
      }

      let imagePath = event.image;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;
      }

      const updatedData = {
        name,
        date,
        category,
        location,
        description,
        image: imagePath,
        services,
        isPublic,
      };

      const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).populate("location", "name")
      .populate("category", "name");

      res
        .status(200)
        .json({ message: "Cập nhật sự kiện thành công!", event: updatedEvent });
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error.message);
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật sự kiện!", error: error.message });
    }
  },

  updateEventPartial: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, date, location, description, category } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role; 

      // Validate event ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID sự kiện không hợp lệ!" });
      }

      // Check if event exists
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Sự kiện không tồn tại!" });
      }

      // Check permissions
      if (
        !event.isPublic &&
        event.createdBy.toString() !== userId &&
        userRole !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền cập nhật sự kiện này!" });
      }

      // Prepare update data (only include fields that are provided)
      const updatedData = {};

      if (name !== undefined) updatedData.name = name;
      if (date !== undefined) updatedData.date = date;
      if (location !== undefined) updatedData.location = location;
      if (description !== undefined) updatedData.description = description;
      if (category !== undefined) {
        if (!mongoose.Types.ObjectId.isValid(category)) {
          return res.status(400).json({ message: "ID danh mục không hợp lệ!" });
        }
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
          return res.status(404).json({ message: "Danh mục không tồn tại!" });
        }
        updatedData.category = category;
      }

      // Handle image update and cleanup
      if (req.file) {
        // If there's an existing image, delete it
        if (event.image) {
          const oldImagePath = path.join(__dirname, "..", event.image); // Adjust path based on your project structure
          try {
            await fs.unlink(oldImagePath);
          } catch (err) {
            console.error(`Failed to delete old image: ${oldImagePath}`, err);
            // Don't throw an error; proceed with update even if deletion fails
          }
        }
        updatedData.image = `/uploads/${req.file.filename}`;
      }

      // Update the event with only the provided fields
      const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, {
        new: true, // Return the updated document
      }).populate("location", "name")
      .populate("category", "name");

      res
        .status(200)
        .json({ message: "Cập nhật sự kiện thành công!", event: updatedEvent });
    } catch (error) {
      console.error("Lỗi khi cập nhật sự kiện:", error.message);
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật sự kiện!", error: error.message });
    }
  },

  updateEventCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { category } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID!" });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found!" });
      }

      // Check access rights
      if (event.createdBy.toString() !== userId && userRole !== "admin") {
        return res
          .status(403)
          .json({
            message: "You do not have permission to update this event!",
          });
      }

      // Check if the category is valid
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: "Invalid category ID!" });
      }

      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found!" });
      }

      event.category = category;
      await event.save();

      res
        .status(200)
        .json({ message: "Category updated successfully!", event });
    } catch (error) {
      console.error("Error updating category:", error.message);
      res
        .status(500)
        .json({ message: "Error updating category!", error: error.message });
    }
  },

  updateEventStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { isPublic } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID!" });
      }

      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found!" });
      }

      // Check access rights
      if (event.createdBy.toString() !== userId && userRole !== "admin") {
        return res
          .status(403)
          .json({
            message: "You do not have permission to update this event!",
          });
      }

      event.isPublic = isPublic;
      await event.save();

      res
        .status(200)
        .json({ message: "Event status updated successfully!", event });
    } catch (error) {
      console.error("Error updating event status:", error.message);
      res.status(500).json({ message: "Server error!", error: error.message });
    }
  },
  // Xóa sự kiện
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const event = await Event.findById(id);

      if (!event) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sự kiện để xóa!" });
      }

      // Kiểm tra quyền xóa
      if (event.createdBy.toString() !== userId && userRole !== "admin") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền xóa sự kiện này!" });
      }

      await Event.findByIdAndDelete(id);

      res.status(200).json({ message: "Xóa sự kiện thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa sự kiện:", error.message);
      res.status(500).json({ message: "Lỗi server!" });
    }
  },
  // Thêm dịch vụ vào sự kiện
  addServiceToEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const { serviceId, quantity } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
      }

      if (service.quantity < quantity) {
        return res.status(400).json({ message: "Không đủ số lượng dịch vụ!" });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Sự kiện không tồn tại!" });
      }

      // Kiểm tra quyền (người tạo hoặc admin)
      if (event.createdBy.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({
          message: "Bạn không có quyền thêm dịch vụ vào sự kiện này!",
        });
      }

      event.services.push({ service: serviceId, quantity });
      await event.save();

      // Giảm số lượng dịch vụ
      service.quantity -= quantity;
      await service.save();

      const updatedEvent = await Event.findById(eventId).populate(
        "services.service",
        "name price"
      );
      res
        .status(200)
        .json({ message: "Thêm dịch vụ thành công!", event: updatedEvent });
    } catch (error) {
      console.error("Lỗi khi thêm dịch vụ:", error.message);
      res.status(500).json({ message: "Lỗi khi thêm dịch vụ!" });
    }
  },

  // Xóa dịch vụ khỏi sự kiện
  removeServiceFromEvent: async (req, res) => {
    try {
      const { eventId, serviceId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Sự kiện không tồn tại!" });
      }

      // Kiểm tra quyền (người tạo hoặc admin)
      if (event.createdBy.toString() !== userId && userRole !== "admin") {
        return res.status(403).json({
          message: "Bạn không có quyền xóa dịch vụ khỏi sự kiện này!",
        });
      }

      event.services = event.services.filter(
        (service) => service.service.toString() !== serviceId
      );
      await event.save();

      const updatedEvent = await Event.findById(eventId).populate(
        "services.service",
        "name price"
      );
      res
        .status(200)
        .json({ message: "Xóa dịch vụ thành công!", event: updatedEvent });
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error.message);
      res.status(500).json({ message: "Lỗi khi xóa dịch vụ!" });
    }
  },

  updateServiceInEvent: async (req, res) => {
    try {
        const { eventId, serviceId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Sự kiện không tồn tại!" });
        }

        // Kiểm tra quyền (người tạo hoặc admin)
        if (event.createdBy.toString() !== userId && userRole !== "admin") {
            return res.status(403).json({
                message: "Bạn không có quyền cập nhật dịch vụ trong sự kiện này!",
            });
        }

        const serviceIndex = event.services.findIndex(
            (service) => service.service.toString() === serviceId
        );

        if (serviceIndex === -1) {
            return res
                .status(404)
                .json({ message: "Dịch vụ không tồn tại trong sự kiện!" });
        }

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
        }

        // Lấy số lượng cũ và trả lại vào kho
        const oldQuantity = event.services[serviceIndex].quantity;
        service.quantity += oldQuantity;

        // Kiểm tra nếu số lượng mới có sẵn
        if (service.quantity < quantity) {
            return res
                .status(400)
                .json({ message: "Không đủ số lượng dịch vụ để cập nhật!" });
        }

        // Cập nhật số lượng mới
        event.services[serviceIndex].quantity = quantity;

        // Trừ số lượng mới từ kho
        service.quantity -= quantity;

        await service.save();
        await event.save();

        const updatedEvent = await Event.findById(eventId).populate(
            "services.service",
            "name description price"
        );

        return res.status(200).json({
            message: "Dịch vụ trong sự kiện đã được cập nhật",
            event: updatedEvent,
        });
    } catch (error) {
        console.error("Lỗi server:", error.message);
        return res
            .status(500)
            .json({ message: "Lỗi server!", error: error.message });
    }
},

  // Lấy hoặc tạo hóa đơn
  getInvoiceByEventId: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const event = await Event.findById(eventId).populate("services.service");

      if (!event) {
        return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
      }

      // Kiểm tra quyền truy cập
      if (
        !event.isPublic &&
        event.createdBy.toString() !== userId &&
        userRole !== "admin"
      ) {
        return res.status(403).json({
          message: "Bạn không có quyền truy cập hóa đơn của sự kiện này!",
        });
      }

      let invoice = await Invoice.findOne({ event: eventId });

      if (!invoice) {
        const totalAmount = event.services.reduce(
          (sum, s) => sum + s.quantity * s.service.price,
          0
        );

        invoice = new Invoice({
          event: eventId,
          services: event.services.map((s) => ({
            service: s.service._id,
            quantity: s.quantity,
            price: s.service.price,
          })),
          totalAmount,
        });

        await invoice.save();
      }

      const populatedInvoice = await Invoice.findById(invoice._id)
        .populate("event", "name date category location")
        .populate("services.service", "name price");

      res.status(200).json(populatedInvoice);
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error.message);
      res.status(500).json({ message: "Lỗi khi lấy hóa đơn!" });
    }
  },

  getServiceUsage: async (req, res) => {
    try {
      const events = await Event.find().populate("services.service");
      const serviceUsage = {};

      events.forEach((event) => {
        event.services.forEach((service) => {
          if (!serviceUsage[service.service.name]) {
            serviceUsage[service.service.name] = {
              quantity: 0,
              price: service.service.price,
            };
          }
          serviceUsage[service.service.name].quantity += service.quantity;
        });
      });

      res.status(200).json(serviceUsage);
    } catch (error) {
      console.error("Error fetching service usage:", error.message);
      res.status(500).json({ message: "Server error!" });
    }
  },
};
export default eventController;