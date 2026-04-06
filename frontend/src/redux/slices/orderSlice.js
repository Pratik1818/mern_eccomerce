import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/order/create', orderData);
      return data.order;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getMyOrders = createAsyncThunk('order/getMyOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/me');
    return data.orders;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Failed to fetch orders');
  }
});

export const createRazorpayOrder = createAsyncThunk(
  'order/createRazorpayOrder',
  async ({ amount, orderId }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/order/payment/create', { amount, orderId });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to create payment');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'order/verifyPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/order/payment/verify', payload);
      return data.order;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Payment verification failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    myOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.currentOrder = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, { payload }) => {
        state.myOrders = payload || [];
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, { payload }) => {
        state.currentOrder = payload;
        state.loading = false;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          [createOrder.pending, getMyOrders.pending, verifyPayment.pending].some((a) => a.type === action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          [createOrder.rejected, getMyOrders.rejected, verifyPayment.rejected].some((a) => a.type === action.type),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      );
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
