import express from 'express';
import locationController from '../controllers/locationController.js';
import { authMiddleware,adminMiddleware  } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', locationController.getAllLocations); 
router.post('/', authMiddleware, adminMiddleware,locationController.createLocation); 
router.put('/:id', authMiddleware, adminMiddleware, locationController.updateLocation);
router.delete('/:id', authMiddleware, adminMiddleware, locationController.deleteLocation); 

export default router;