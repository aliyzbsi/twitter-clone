import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getFollowers = createAsyncThunk(
  "/follow/getFollower",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/follow/${userId}/followers`);

      return response.data.content;
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const getFollowing = createAsyncThunk(
  "follow/getFollowing",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/follow/${userId}/following`);
      return response.data.content;
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkFollowStatus = createAsyncThunk(
  "follow/checkStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/follow/check/${userId}`);

      return response.data;
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const followUser = createAsyncThunk(
  "follow/followUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/follow/${userId}`);
      toast.success("Kullanıcı takip ediliyor");
      return response.data;
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/follow/${userId}`);
      toast.success("Kullanıcı takipten çıkıldı");
      return response.data;
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

const followSlice = createSlice({
  name: "follows",
  initialState: {
    followers: [],
    followings: [],
    isFollowing: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(followUser.fulfilled, (state) => {
        state.loading = false;
        state.isFollowing = true;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.fulfilled, (state) => {
        state.isFollowing = false;
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.followings = action.payload;
      })
      .addCase(checkFollowStatus.fulfilled, (state, action) => {
        state.isFollowing = action.payload;
      });
  },
});

export default followSlice.reducer;
