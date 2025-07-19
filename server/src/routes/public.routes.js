import express from 'express';
import { getFormBySlug, submitResponse } from '../controllers/form.controller.js';

const router = express.Router();

router.get('/:slug', getFormBySlug);
router.post('/:slug/submit', submitResponse);

export default router;
