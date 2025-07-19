import express from 'express';
import protect from '../middleware/authMiddleware.js';
import {
  createForm,
  getForms,
  getForm,
  getResponses,
  getSummary,
} from '../controllers/form.controller.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getForms).post(createForm);
router.route('/:id').get(getForm);
router.route('/:id/responses').get(getResponses);
router.route('/:id/summary').get(getSummary);

export default router;
