import BugLog from '../models/BugLog.js';

const errorLogger = async (err, req, res, next) => {
  try {
    const bugLog = new BugLog({
      message: err.message,
      stack: err.stack,
      statusCode: res.statusCode || 500,
      endpoint: req.originalUrl,
      method: req.method,
      user: req.user ? req.user.id : null, 
    });

    await bugLog.save();
    console.error('Error logged:', err.message);
  } catch (logError) {
    console.error('Failed to log error:', logError.message);
  }

  next(err); 
};

export default errorLogger;