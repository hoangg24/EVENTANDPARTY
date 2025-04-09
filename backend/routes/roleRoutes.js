import express from 'express';
import roleController from '../controllers/roleController.js';
const router = express.Router();

// CRUD role
router.post('/', roleController.createRole);
router.get('/', roleController.getRoles);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

export default router;
