import Channel from '../models/channelModel.js';

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const channel = await Channel.create({
      name,
      description,
      owner: req.user._id,
      isPrivate,
      members: [req.user._id], // Add the creator as a member automatically
    });

    if (channel) {
      res.status(201).json(channel);
    } else {
      res.status(400).json({ message: 'Invalid channel data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all channels (public or where user is a member)
// @route   GET /api/channels
// @access  Private
export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      $or: [
        { isPrivate: false },
        { members: req.user._id }
      ]
    }).populate('owner', 'name');

    res.json(channels);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get channel by ID
// @route   GET /api/channels/:id
// @access  Private
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (channel) {
      // Check if channel is private and user is not a member
      if (channel.isPrivate && !channel.members.some(member => member._id.equals(req.user._id))) {
        return res.status(403).json({ message: 'Not authorized to access this channel' });
      }
      
      res.json(channel);
    } else {
      res.status(404).json({ message: 'Channel not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a channel
// @route   PUT /api/channels/:id
// @access  Private (owner only)
export const updateChannel = async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is the channel owner
    if (!channel.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this channel' });
    }

    channel.name = name || channel.name;
    channel.description = description || channel.description;
    channel.isPrivate = isPrivate !== undefined ? isPrivate : channel.isPrivate;

    const updatedChannel = await channel.save();
    res.json(updatedChannel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a channel
// @route   DELETE /api/channels/:id
// @access  Private (owner only)
export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is the channel owner
    if (!channel.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this channel' });
    }

    await channel.deleteOne();
    res.json({ message: 'Channel removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Join a channel
// @route   PUT /api/channels/:id/join
// @access  Private
export const joinChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if channel is private
    if (channel.isPrivate) {
      return res.status(403).json({ message: 'Cannot join a private channel' });
    }

    // Check if user is already a member
    if (channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member of this channel' });
    }

    channel.members.push(req.user._id);
    await channel.save();

    res.json({ message: 'Joined channel successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Leave a channel
// @route   PUT /api/channels/:id/leave
// @access  Private
export const leaveChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    // Check if user is the owner
    if (channel.owner.equals(req.user._id)) {
      return res.status(400).json({ message: 'Channel owner cannot leave the channel' });
    }

    // Check if user is a member
    if (!channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not a member of this channel' });
    }

    channel.members = channel.members.filter(
      member => !member.equals(req.user._id)
    );
    await channel.save();

    res.json({ message: 'Left channel successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}; 