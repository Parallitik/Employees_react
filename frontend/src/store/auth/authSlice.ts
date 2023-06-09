import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import $api from '../../axios';
import { AuthResponse, AuthState, User } from './types';
import axios from 'axios';

export const userRegistration = createAsyncThunk(
  'auth/userRegistration',
  async (
    payload: { name: string; email: string; password: string },
    thunkApi
  ) => {
    try {
      const res = await $api.post<AuthResponse>('/user/registration', payload);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Не удалось зарегистрировать пользователя: ${error}`
      );
    }
  }
);
export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async (payload: { email: string; password: string }, thunkApi) => {
    try {
      const res = await $api.post<AuthResponse>('/user/login', payload);
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(`Не удается авторизоваться: ${error}`);
    }
  }
);

export const userLogout = createAsyncThunk(
  'auth/userLogout',
  async (_, thunkApi) => {
    try {
      await $api.post('/user/logout');
      return;
    } catch (error) {
      return thunkApi.rejectWithValue(`Не удается выйти: ${error}`);
    }
  }
);

export const checkAuthUser = createAsyncThunk(
  'auth/checkAuthUser',
  async (_, thunkApi) => {
    try {
      const res = await axios.get<AuthResponse>(
        `${process.env.REACT_APP_BASE_URL}/user/refresh`,
        { withCredentials: true }
      );
      console.log(res.data);

      return res.data;
    } catch (error) {
      console.log('Error', error);
      return thunkApi.rejectWithValue(
        `Не удается получить информацию об авторизации пользователя: ${error}`
      );
    }
  }
);

const initialState: AuthState = {
  user: {},
  isAuth: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      userLogin.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuth = true;
        state.user = action.payload.user;
      }
    );
    builder.addCase(userLogout.fulfilled, (state, _) => {
      localStorage.removeItem('token');
      state.isAuth = false;
      state.user = {} as User;
    });
    builder.addCase(checkAuthUser.pending, (state, _) => {
      state.isLoading = true;
    });
    builder.addCase(
      checkAuthUser.fulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        localStorage.setItem('token', action.payload.accessToken);
        state.isAuth = true;
        state.user = action.payload.user;
        state.isLoading = false;
      }
    );
  },
});

export const { ...args } = authSlice.actions;
export default authSlice.reducer;
