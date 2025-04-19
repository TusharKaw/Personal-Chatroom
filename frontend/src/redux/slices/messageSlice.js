import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageAPI } from '../../utils/api';

const initialState = {
  messages: [],
  isLoading: false,
  isError: false,
  errorMessage: '',
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

// Get channel messages
export const getChannelMessages = createAsyncThunk(
  'message/getChannelMessages',
  async ({ channelId, page = 1, limit = 50 }, { rejectWithValue }) => {
    try {
      const { data } = await messageAPI.getChannelMessages(channelId, page, limit);
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

// Create a new message
export const createMessage = createAsyncThunk(
  'message/createMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const { data } = await messageAPI.createMessage(messageData);
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

// Delete a message
export const deleteMessage = createAsyncThunk(
  'message/deleteMessage',
  async (id, { rejectWithValue }) => {
    try {
      await messageAPI.deleteMessage(id);
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

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      // This is for handling real-time messages from socket.io
      state.messages.push(action.payload);
    },
    resetMessages: (state) => {
      state.messages = [];
      state.pagination = {
        page: 1,
        pages: 1,
        total: 0,
      };
    },
    resetMessageError: (state) => {
      state.isError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get channel messages
      .addCase(getChannelMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChannelMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          // Replace all messages if it's the first page
          state.messages = action.payload.messages;
        } else {
          // Prepend older messages (they come in reverse chronological order)
          state.messages = [...action.payload.messages, ...state.messages];
        }
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getChannelMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Create message
      .addCase(createMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      
      // Delete message
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(message => message._id !== action.payload);
      });
  },
});

export const { addMessage, resetMessages, resetMessageError } = messageSlice.actions;
export default messageSlice.reducer; 