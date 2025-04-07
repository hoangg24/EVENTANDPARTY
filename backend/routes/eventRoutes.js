import express from "express";
import eventController from "../controllers/eventController.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js";
const router = express.Router();

// POST: Thêm sự kiện (user bình thường cũng có thể tạo sự kiện)
router.post("/create", authMiddleware, upload, eventController.createEvent);

// GET: Lấy danh sách sự kiện
router.get("/", authMiddleware, eventController.getEvents);
router.get("/service-usage", eventController.getServiceUsage);
// GET: Lấy sự kiện theo ID
router.get("/:id", authMiddleware, eventController.getEventById);
router.patch(
  "/:id/category",
  authMiddleware,
  eventController.updateEventCategory
);
router.patch("/:id/status", authMiddleware, eventController.updateEventStatus);
router.patch(
  "/update-partial/:id",
  authMiddleware,
  upload,
  eventController.updateEventPartial
);

// PUT: Cập nhật sự kiện (Chỉ admin)
router.put("/:id", authMiddleware, upload, eventController.updateEvent);

// DELETE: Xóa sự kiện (Chỉ admin)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  eventController.deleteEvent
);
// POST: Thêm dịch vụ vào sự kiện (chỉ admin hoặc người tạo sự kiện)
router.post(
  "/:eventId/add-service",
  authMiddleware,
  eventController.addServiceToEvent
);

// DELETE: Xóa dịch vụ khỏi sự kiện (chỉ admin hoặc người tạo sự kiện)
router.delete(
  "/:eventId/remove-service/:serviceId",
  authMiddleware,
  eventController.removeServiceFromEvent
);

// PUT: Cập nhật dịch vụ trong sự kiện (chỉ admin hoặc người tạo sự kiện)
router.put(
  "/:eventId/update-service/:serviceId",
  authMiddleware,
  eventController.updateServiceInEvent
);

// GET: Lấy hoặc tạo hóa đơn (chỉ admin, người tạo hoặc người dùng nếu sự kiện là public)
router.get(
  "/:eventId/invoice",
  authMiddleware,
  eventController.getInvoiceByEventId
);

export default router;