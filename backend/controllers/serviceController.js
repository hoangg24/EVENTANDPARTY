import Service from "../models/service.js";
const serviceController = {
  // Lấy danh sách tất cả dịch vụ
  getAllServices: async (req, res) => {
    try {
      const services = await Service.find();
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách dịch vụ", error });
    }
  },
  getServiceById: async (req, res) => {
    try {
      const { id } = req.params;
      const services = await Service.findById(id);
      if (!services) {
        return res.status(404).json({ message: "Không tìm thấy sự kiện!" });
      }
      res.status(200).json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy sự kiện!" });
    }
  },
  // Tạo dịch vụ mới
  createService: async (req, res) => {
    try {
      const { name, description, quantity, price } = req.body;
      const newService = new Service({ name, description, quantity, price });
      await newService.save();
      res.status(201).json(newService);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi tạo dịch vụ mới", error });
    }
  },

  // Cập nhật dịch vụ
  updateService: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, quantity, price } = req.body;
      const updatedService = await Service.findByIdAndUpdate(
        id,
        { name, description, quantity, price },
        { new: true }
      );
      res.status(200).json(updatedService);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật dịch vụ", error });
    }
  },

  // Xóa dịch vụ
  deleteService: async (req, res) => {
    try {
      const { id } = req.params;
      await Service.findByIdAndDelete(id);
      res.status(200).json({ message: "Dịch vụ đã được xóa thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa dịch vụ", error });
    }
  },

};
export default serviceController;
