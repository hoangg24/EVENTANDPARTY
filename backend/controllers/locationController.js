import Location from '../models/Location.js';

const locationController = {
  // Lấy danh sách tất cả các địa điểm
  getAllLocations: async (req, res) => {
    try {
      const locations = await Location.find();
      res.status(200).json(locations);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách địa điểm', error: error.message });
    }
  },

  // Tạo địa điểm mới
  createLocation: async (req, res) => {
    try {
      const { name, address, city, country } = req.body;

      // Kiểm tra xem địa điểm đã tồn tại chưa
      const existingLocation = await Location.findOne({ name });
      if (existingLocation) {
        return res.status(400).json({ message: 'Địa điểm đã tồn tại' });
      }

      const location = new Location({ name, address, city, country });
      await location.save();
      res.status(201).json({ message: 'Tạo địa điểm thành công', location });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo địa điểm', error: error.message });
    }
  },


  // Xóa địa điểm
  deleteLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedLocation = await Location.findByIdAndDelete(id);
      if (!deletedLocation) {
        return res.status(404).json({ message: 'Địa điểm không tồn tại' });
      }
      res.status(200).json({ message: 'Xóa địa điểm thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa địa điểm', error: error.message });
    }
  },
// Sửa địa điểm
updateLocation: async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address, city, country } = req.body;

        const updatedLocation = await Location.findByIdAndUpdate(
            id,
            { name, address, city, country },
            { new: true, runValidators: true }
        );

        if (!updatedLocation) {
            return res.status(404).json({ message: 'Địa điểm không tồn tại' });
        }

        res.status(200).json({ message: 'Cập nhật địa điểm thành công', location: updatedLocation });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật địa điểm', error: error.message });
    }
}
};

export default locationController;