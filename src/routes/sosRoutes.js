import { Router } from 'express';
import { receiveSos, getAllEvents, updateEventStatus } from '../controllers/sosController.js';
import { validateSosPayload } from '../middleware/validateSos.js';

const router = Router();

router.post('/api/sos', validateSosPayload, receiveSos);
router.get('/api/events', getAllEvents);
router.patch('/api/events/:id', updateEventStatus);

export default router;