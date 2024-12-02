import { configureStore } from '@reduxjs/toolkit';
import cvReducer from './slices/cvSlice';
import templateReducer from './slices/templateSlice';

export const store = configureStore({
  reducer: {
    cv: cvReducer,
    templates: templateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 