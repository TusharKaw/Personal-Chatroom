import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import channelReducer from './slices/channelSlice';
import messageReducer from './slices/messageSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer,
    message: messageReducer,
  },
});

export default store; 