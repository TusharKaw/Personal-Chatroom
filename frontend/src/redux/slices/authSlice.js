import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get user from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  isError: false,
  errorMessage: '',
};

// Define a base URL
const API_URL = 'http://localhost:5000/api';

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('login thunk called with email:', email);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Use API_URL to construct the full endpoint
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        config
      );

      console.log('Login success, data received:', data);
      
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Login failed:', error);
      
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        
      console.error('Error message:', errorMsg);
      
      return rejectWithValue(errorMsg);
    }
  }
);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      console.log('register thunk called with email:', email);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Use API_URL to construct the full endpoint
      const { data } = await axios.post(
        `${API_URL}/users`,
        { name, email, password },
        config
      );

      console.log('Registration success, data received:', data);
      
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      
      const errorMsg = error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        
      console.error('Error message:', errorMsg);
      
      return rejectWithValue(errorMsg);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('userInfo');
      state.userInfo = null;
    },
    resetError: (state) => {
      state.isError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        console.log('Login fulfilled, userInfo set:', action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        console.error('Login rejected, error set:', action.payload);
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userInfo = action.payload;
        console.log('Registration fulfilled, userInfo set:', action.payload);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        console.error('Registration rejected, error set:', action.payload);
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer; 