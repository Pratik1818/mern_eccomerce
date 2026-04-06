import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/register', userData);
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/login', { email, password });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Login failed');
  }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/profile');
    return data.user;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to load user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/profile/update', payload);
    return data.user;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, { payload }) => {
        state.user = payload;
      })
      .addMatcher(
        (action) => [register.pending, login.pending, loadUser.pending].some((a) => a.type === action.type),
        (state) => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        (action) => [register.rejected, login.rejected, loadUser.rejected].some((a) => a.type === action.type),
        (state, { payload }) => { state.loading = false; state.error = payload; }
      );
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
