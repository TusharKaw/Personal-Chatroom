import express from 'express';
import { 
  createChannel, 
  getChannels, 
  getChannelById, 
  updateChannel, 
  deleteChannel,
  joinChannel,
  leaveChannel
} from '../controllers/channelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createChannel)
  .get(protect, getChannels);

router.route('/:id')
  .get(protect, getChannelById)
  .put(protect, updateChannel)
  .delete(protect, deleteChannel);

router.route('/:id/join').put(protect, joinChannel);
router.route('/:id/leave').put(protect, leaveChannel);

export default router; 