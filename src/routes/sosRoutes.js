import express from 'express';
import { handleSosIngestion, getActiveEvents, updateEventStatus } from '../controllers/sosController.js';
import { validateSosPayload } from '../middleware/validateSos.js';

const router = express.Router();

router.post('/api/sos', validateSosPayload, handleSosIngestion);
router.get('/api/events', getActiveEvents);
router.patch('/api/events/:id', updateEventStatus);

export default router;