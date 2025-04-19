import express from 'express';
import { 
  createMessage, 
  getChannelMessages, 
  deleteMessage 
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMessage);

router.route('/channel/:channelId')
  .get(protect, getChannelMessages);

router.route('/:id')
  .delete(protect, deleteMessage);

export default router; 