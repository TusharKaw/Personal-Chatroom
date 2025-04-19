import Message from '../models/messageModel.js';
import Channel from '../models/channelModel.js';

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
export const createMessage = async (req, res) => {
  try {
    const { content, channelId, attachments } = req.body;

    // Verify channel exists and user is a member
    const channel = await Channel.findById(channelId);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if channel is private and user is a member
    if (channel.isPrivate && !channel.members.some(member => member.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to post in this channel' });
    }

    const message = await Message.create({
      content,
      channel: channelId,
      sender: req.user._id,
      readBy: [req.user._id], // Sender has read their own message
      attachments: attachments || [],
    });

    // Populate sender details for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('channel', 'name');

    if (populatedMessage) {
      res.status(201).json(populatedMessage);
    } else {
      res.status(400).json({ message: 'Invalid message data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get messages for a channel
// @route   GET /api/messages/channel/:channelId
// @access  Private
export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Verify channel exists and user is a member
    const channel = await Channel.findById(channelId);
    
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if channel is private and user is not a member
    if (channel.isPrivate && !channel.members.some(member => member.equals(req.user._id))) {
      return res.status(403).json({ message: 'Not authorized to view messages in this channel' });
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get messages with pagination, sorted by createdAt in descending order
    const messages = await Message.find({ channel: channelId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sender', 'name email')
      .populate('channel', 'name');

    // Get total count for pagination info
    const totalMessages = await Message.countDocuments({ channel: channelId });

    // Mark messages as read by current user
    await Message.updateMany(
      { 
        channel: channelId, 
        _id: { $in: messages.map(msg => msg._id) },
        readBy: { $ne: req.user._id } 
      },
      { $push: { readBy: req.user._id } }
    );

    res.json({
      messages: messages.reverse(), // Return in chronological order
      page: parseInt(page),
      pages: Math.ceil(totalMessages / parseInt(limit)),
      total: totalMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private (sender only or channel owner)
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('channel', 'owner');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender or channel owner
    if (!message.sender.equals(req.user._id) && !message.channel.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();
    res.json({ message: 'Message removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 