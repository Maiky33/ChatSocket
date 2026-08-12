import express from 'express';
import Controller from '../Controllers/Conversations.js';
import {authRequired} from '../middlewares/authRequired.js'

const router = express.Router();

router.post('/conversations', authRequired, Controller.save);
router.get('/conversations', authRequired,Controller.getConversations);
export default router;