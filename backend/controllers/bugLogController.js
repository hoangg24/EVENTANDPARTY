import BugLog from '../models/BugLog.js';

const bugLogController = {
  getAllLogs: async (req, res) => {
    try {
      const logs = await BugLog.find().sort({ createdAt: -1 });
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching bug logs:', error.message);
      res.status(500).json({ message: 'Error fetching bug logs' });
    }
  },
deleteLog: async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLog = await BugLog.findByIdAndDelete(id);
        if (!deletedLog) {
            return res.status(404).json({ message: 'Bug log not found' });
        }
        res.status(200).json({ message: 'Bug log deleted successfully' });
    } catch (error) {
        console.error('Error deleting bug log:', error.message);
        res.status(500).json({ message: 'Error deleting bug log' });
    }
}
};

export default bugLogController;