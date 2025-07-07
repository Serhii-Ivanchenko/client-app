import { initialState } from '../initialState.js';
import { createSlice } from '@reduxjs/toolkit';
import {
  getMechanicBalance,
  getUserData,
  logIn,
  logOut,
  refreshUser,
} from './operations.js';

const handlePending = state => {
  state.isLoading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  {
    state.isLoading = false;
    state.error = action.payload;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState.auth,
  reducers: {},
  extraReducers: builder =>
    builder
      //Login
      .addCase(logIn.pending, handlePending)
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.apiKey = action.payload.api_key;
      })
      .addCase(logIn.rejected, handleRejected)

      // Logout
      .addCase(logOut.pending, handlePending)
      .addCase(logOut.fulfilled, state => {
        return { ...initialState.auth, isLoggedIn: false };
      })
      .addCase(logOut.rejected, handleRejected)

      // Get user data
      .addCase(getUserData.pending, handlePending)
      .addCase(getUserData.fulfilled, (state, action) => {
        state.userData = {
          ...state.userData, // Зберігаємо поточні значення
          ...action.payload, // Додаємо нові дані
        };
        // Отримуємо дані з persist:authSlice
        const persistedAuthSlice = JSON.parse(
          localStorage.getItem('persist:authSlice')
        );
        const storedUserData = persistedAuthSlice?.userData
          ? JSON.parse(persistedAuthSlice.userData)
          : null;
        const storedServiceId = storedUserData?.selectedServiceId;

        // Якщо є selectedServiceId в локальному сховищі, використовуємо його
        if (storedServiceId) {
          state.userData.selectedServiceId = storedServiceId;
        } else {
          // Якщо немає, використовуємо значення з сервера
          // state.userData.selectedServiceId = action.payload.services[0]?.id;
          state.userData.selectedServiceId = action.payload.company_id;
        }

        state.isLoading = false;
      })
      .addCase(getUserData.rejected, handleRejected)

      //Get mechanic balance data
      .addCase(getMechanicBalance.pending, handlePending)
      .addCase(getMechanicBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
        state.isLoading = false;
      })
      .addCase(getMechanicBalance.rejected, handleRejected)

      //Refresh
      .addCase(refreshUser.pending, state => {
        state.isRefreshing = true;
        state.isLoading = true;
        state.error = null;
      })

      .addCase(refreshUser.fulfilled, (state, action) => {
        // Перевіряємо, чи є значення selectedServiceId у локальному сховищі
        const persistedAuthSlice = JSON.parse(
          localStorage.getItem('persist:authSlice')
        );
        const storedUserData = persistedAuthSlice?.userData
          ? JSON.parse(persistedAuthSlice.userData)
          : null;

        // Якщо є selectedServiceId в локальному сховищі, використовуємо його
        if (storedUserData && storedUserData.selectedServiceId) {
          state.userData = { ...state.userData, ...action.payload };
          state.userData.selectedServiceId = storedUserData.selectedServiceId;
        } else {
          // Якщо немає, беремо значення з сервера
          state.userData = { ...state.userData, ...action.payload };
          state.userData.selectedServiceId =
            action.payload.services?.[0]?.id || null;
        }
        state.isLoading = false;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.apiKey = action.payload.api_key;
      })

      .addCase(refreshUser.rejected, (state, action) => {
        state.apiKey = null;
        state.isRefreshing = false;
        state.isLoading = false;
        state.error = action.payload;
      }),
});

export default authSlice.reducer;
