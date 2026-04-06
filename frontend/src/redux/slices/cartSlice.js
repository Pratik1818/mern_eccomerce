import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const s = localStorage.getItem('cart');
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, { payload }) => {
      const { product, quantity = 1 } = payload;
      const existing = state.items.find((i) => i.product._id === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image?.[0]?.url || '',
          },
          quantity,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i.product._id !== payload.productId);
      saveCart(state.items);
    },
    setQuantity: (state, { payload }) => {
      const item = state.items.find((i) => i.product._id === payload.productId);
      if (item) {
        item.quantity = Math.max(1, Number(payload.quantity) || 1);
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { addToCart, removeFromCart, setQuantity, clearCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
export default cartSlice.reducer;
