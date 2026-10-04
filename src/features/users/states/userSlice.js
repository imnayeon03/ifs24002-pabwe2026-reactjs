import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, getProfile, updateProfile, updateProfilePhoto, updatePassword } from '../api/userApi';
import { showSuccessDialog, showErrorDialog } from '../../../helpers/toolsHelper';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await getUsers();
    return response.data.users;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const isProfile = createAsyncThunk('users/isProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await getProfile();
    return response.data.user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const isChangeProfile = createAsyncThunk('users/isChangeProfile', async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await updateProfile(data);
    showSuccessDialog('Profil berhasil diperbarui!');
    dispatch(isProfile());
    return response.data;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const isChangeProfilePhoto = createAsyncThunk('users/isChangeProfilePhoto', async (file, { rejectWithValue, dispatch }) => {
  try {
    const response = await updateProfilePhoto(file);
    if (!response.status && response.message) throw new Error(response.message);
    showSuccessDialog('Foto profil berhasil diperbarui!');
    dispatch(isProfile());
    return response.data;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

export const isChangeProfilePassword = createAsyncThunk('users/isChangeProfilePassword', async (data, { rejectWithValue }) => {
  try {
    const response = await updatePassword(data);
    showSuccessDialog('Password berhasil diubah!');
    return response.data;
  } catch (error) {
    showErrorDialog(error.message);
    return rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(isProfile.fulfilled, (state, action) => { state.profile = action.payload; })
      
      .addCase(isChangeProfile.pending, (state) => { state.loading = true; })
      .addCase(isChangeProfile.fulfilled, (state) => { state.loading = false; })
      .addCase(isChangeProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(isChangeProfilePhoto.pending, (state) => { state.loading = true; })
      .addCase(isChangeProfilePhoto.fulfilled, (state) => { state.loading = false; })
      .addCase(isChangeProfilePhoto.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      .addCase(isChangeProfilePassword.pending, (state) => { state.loading = true; })
      .addCase(isChangeProfilePassword.fulfilled, (state) => { state.loading = false; })
      .addCase(isChangeProfilePassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default userSlice.reducer;
