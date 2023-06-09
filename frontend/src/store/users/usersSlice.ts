import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import $api from '../../axios';
import { Users, UsersState } from './types';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, thunkApi) => {
    try {
      const res = await $api.get<Users>('/user/users');
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        `Не удалось зарегистрировать пользователя: ${error}`
      );
    }
  }
);

const initialState: UsersState = {
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<Users>) => {
        state.users = action.payload;
      }
    );
  },
});

export const { ...args } = usersSlice.actions;
export default usersSlice.reducer;
