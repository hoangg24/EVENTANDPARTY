import Role from '../models/roleModel.js';

const roleController = {
  // Tạo role mới
  createRole: async (req, res) => {
    try {
      const { name, description } = req.body;
      const existing = await Role.findOne({ name });
      if (existing) {
        return res.status(400).json({ message: "Role đã tồn tại!" });
      }

      const role = new Role({ name, description });
      await role.save();
      res.status(201).json({ message: "Tạo role thành công!", role });
    } catch (error) {
      console.error("Lỗi khi tạo role:", error.message);
      res.status(500).json({ message: "Lỗi server!" });
    }
  },

  // Lấy tất cả role
  getRoles: async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error) {
      console.error("Lỗi khi lấy roles:", error.message);
      res.status(500).json({ message: "Lỗi server!" });
    }
  },

  // Cập nhật role
  updateRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const updatedRole = await Role.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      );

      if (!updatedRole) {
        return res.status(404).json({ message: "Không tìm thấy role!" });
      }

      res.status(200).json({ message: "Cập nhật role thành công!", role: updatedRole });
    } catch (error) {
      console.error("Lỗi khi cập nhật role:", error.message);
      res.status(500).json({ message: "Lỗi server!" });
    }
  },

  // Xóa role
  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedRole = await Role.findByIdAndDelete(id);

      if (!deletedRole) {
        return res.status(404).json({ message: "Role không tồn tại!" });
      }

      res.status(200).json({ message: "Xóa role thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa role:", error.message);
      res.status(500).json({ message: "Lỗi server!" });
    }
  },
};

export default roleController;
