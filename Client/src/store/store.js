import { configureStore } from '@reduxjs/toolkit';
import { invoiceApi } from '../api/invoiceApi';

export const store = configureStore({
  reducer: {
    [invoiceApi.reducerPath]: invoiceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(invoiceApi.middleware),
});

export default store;