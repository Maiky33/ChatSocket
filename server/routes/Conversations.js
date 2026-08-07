import express from 'express';
import Controller from '../Controllers/Conversations.js';

const router = express.Router();

router.post('/conversations', Controller.save);
router.get('/conversations', Controller.getConversations);

export default router;