import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { channelAPI } from '../../utils/api';

const initialState = {
  channels: [],
  currentChannel: null,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

// Get all channels
export const getChannels = createAsyncThunk(
  'channel/getChannels',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.getChannels();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get channel by ID
export const getChannelById = createAsyncThunk(
  'channel/getChannelById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.getChannelById(id);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Create a new channel
export const createChannel = createAsyncThunk(
  'channel/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.createChannel(channelData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update a channel
export const updateChannel = createAsyncThunk(
  'channel/updateChannel',
  async ({ id, channelData }, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.updateChannel(id, channelData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Delete a channel
export const deleteChannel = createAsyncThunk(
  'channel/deleteChannel',
  async (id, { rejectWithValue }) => {
    try {
      await channelAPI.deleteChannel(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Join a channel
export const joinChannel = createAsyncThunk(
  'channel/joinChannel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.joinChannel(id);
      return { id, data };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Leave a channel
export const leaveChannel = createAsyncThunk(
  'channel/leaveChannel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await channelAPI.leaveChannel(id);
      return { id, data };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    clearCurrentChannel: (state) => {
      state.currentChannel = null;
    },
    resetChannelError: (state) => {
      state.isError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get channels
      .addCase(getChannels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload;
      })
      .addCase(getChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Get channel by ID
      .addCase(getChannelById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChannelById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChannel = action.payload;
      })
      .addCase(getChannelById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Create channel
      .addCase(createChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Update channel
      .addCase(updateChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = state.channels.map(channel => 
          channel._id === action.payload._id ? action.payload : channel
        );
        if (state.currentChannel && state.currentChannel._id === action.payload._id) {
          state.currentChannel = action.payload;
        }
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Delete channel
      .addCase(deleteChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteChannel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = state.channels.filter(channel => channel._id !== action.payload);
        if (state.currentChannel && state.currentChannel._id === action.payload) {
          state.currentChannel = null;
        }
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Join & Leave channel - after refreshing channel list will show updated state
      .addCase(joinChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(joinChannel.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(joinChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      .addCase(leaveChannel.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(leaveChannel.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(leaveChannel.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { setCurrentChannel, clearCurrentChannel, resetChannelError } = channelSlice.actions;
export default channelSlice.reducer; 