import express from 'express';

const router = express.Router();

router.get('/throw-error', (req, res) => {
  throw new Error('Lỗi test để ghi buglog!');
});

export default router;
