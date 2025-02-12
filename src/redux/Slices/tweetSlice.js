import api from "@/service/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Async Thunks
export const fetchLatestTweets = createAsyncThunk(
  "tweets/fetchLatestTweets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tweet?size=5");
      return response.data.content;
    } catch (error) {
      toast.error("Tweet'ler yüklenirken bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTweets = createAsyncThunk(
  "tweets/fetchTweets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tweet");
      return response.data.content;
    } catch (error) {
      toast.error("Tweet'ler yüklenirken bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchUserTweets = createAsyncThunk(
  "tweet/userTweet",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tweet/user/${userId}`);
      console.log(response.data);
      return response.data.content;
    } catch (error) {
      toast.error("Tweet'ler yüklenirken bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchReplyTweetsForParentTweet = createAsyncThunk(
  "tweets/replies",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/tweet/${tweetId}/reply`);
      return response.data.content;
    } catch (error) {
      toast.error("Yanıtlar yüklenirken bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchTweetByID = createAsyncThunk(
  "tweets/fetchTweetByID",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`tweet/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Tweet yüklenirken bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createTweet = createAsyncThunk(
  "tweets/createNewTweet",
  async (tweetData, { rejectWithValue }) => {
    try {
      const response = await api.post("/tweet", tweetData);
      if (response.data) {
        toast.success("Tweet paylaşıldı");
        return response.data;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Tweet paylaşılırken bir hata oluştu"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

export const replyTweet = createAsyncThunk(
  "tweets/replyTweet",
  async ({ parentTweetId, tweetData }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/tweet/${parentTweetId}/reply`,
        tweetData
      );
      if (response.data) {
        toast.success("Yanıt paylaşıldı");
        return response.data;
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Yanıt paylaşılırken bir hata oluştu"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

export const likeTweet = createAsyncThunk(
  "tweets/likeTweet",
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await api.post(`tweet/${tweetId}/like`);
      console.log(response.data);
      toast.success(
        response.data.liked ? "Tweet beğenildi" : "Beğeni geri alındı"
      );
      return { tweetId, data: response.data };
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const retweetTweet = createAsyncThunk(
  "tweets/retweetTweet",
  async (tweetId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post(`tweet/${tweetId}/retweet`);
      if (response.data) {
        toast.success(
          response.data.retweeted ? "Retweetlendi" : "Retweet geri alındı"
        );

        return { tweetId, data: response.data };
      }
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateTweet = createAsyncThunk(
  "tweets/updateTweet",
  async ({ tweetId, tweetData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/tweet/${tweetId}`, tweetData);
      toast.success("Tweet güncellendi");
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Tweet güncellenirken bir hata oluştu"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteTweet = createAsyncThunk(
  "tweets/deleteTweet",
  async (tweetId, { rejectWithValue }) => {
    try {
      await api.delete(`/tweet/${tweetId}`);
      toast.success("Tweet silindi");
      return tweetId;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Tweet silinirken bir hata oluştu"
      );
      return rejectWithValue(error.response?.data);
    }
  }
);

const tweetSlice = createSlice({
  name: "tweets",
  initialState: {
    tweets: [],
    userTweet: [],
    currentTweet: null,
    replies: [],
    repliesLoading: false,
    repliesError: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReplies: (state) => {
      state.replies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Tweet Listesi
      .addCase(fetchTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.tweets = action.payload;
        state.loading = false;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.userTweet = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Son Tweet'ler
      .addCase(fetchLatestTweets.fulfilled, (state, action) => {
        const existingIds = new Set(state.tweets.map((t) => t.id));
        const newTweets = action.payload.filter((t) => !existingIds.has(t.id));
        state.tweets = [...newTweets, ...state.tweets];
      })

      // Tweet Detay
      .addCase(fetchTweetByID.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTweetByID.fulfilled, (state, action) => {
        state.currentTweet = action.payload;
        state.loading = false;
      })
      .addCase(fetchTweetByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Tweet Oluşturma
      .addCase(createTweet.fulfilled, (state, action) => {
        const existingTweet = state.tweets.find(
          (t) => t.id === action.payload.id
        );
        if (!existingTweet) {
          state.tweets.unshift(action.payload);
        }
      })

      // Yanıtlar
      .addCase(fetchReplyTweetsForParentTweet.pending, (state) => {
        state.repliesLoading = true;
      })
      .addCase(fetchReplyTweetsForParentTweet.fulfilled, (state, action) => {
        state.replies = action.payload;
        state.repliesLoading = false;
      })
      .addCase(fetchReplyTweetsForParentTweet.rejected, (state, action) => {
        state.repliesLoading = false;
        state.repliesError = action.payload;
      })

      // Yanıt Oluşturma
      .addCase(replyTweet.fulfilled, (state, action) => {
        const existingReply = state.replies.find(
          (reply) => reply.id === action.payload.id
        );
        if (!existingReply) {
          state.replies.unshift(action.payload);
        }
        if (
          state.currentTweet &&
          action.payload.parentTweetId === state.currentTweet.id
        ) {
          state.currentTweet.replyCount =
            (state.currentTweet.replyCount || 0) + 1;
        }
      })

      // Beğeni
      .addCase(likeTweet.fulfilled, (state, action) => {
        const { tweetId, data } = action.payload;
        const tweetIndex = state.tweets.findIndex((t) => t.id === tweetId);
        if (tweetIndex !== -1) {
          state.tweets[tweetIndex] = { ...state.tweets[tweetIndex], ...data };
        }
        if (state.currentTweet?.id === tweetId) {
          state.currentTweet = { ...state.currentTweet, ...data };
        }
      })

      // Retweet
      .addCase(retweetTweet.fulfilled, (state, action) => {
        const { tweetId, data } = action.payload;
        const tweetIndex = state.tweets.findIndex((t) => t.id === tweetId);
        if (tweetIndex !== -1) {
          state.tweets[tweetIndex] = {
            ...state.tweets[tweetIndex],
            ...data,
            retweeted: data.retweeted,
          };
        }
      })
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(
          (tweet) => tweet.id !== action.payload
        );
        if (state.currentTweet?.id === action.payload) {
          state.currentTweet = null;
        }
      })
      .addCase(updateTweet.fulfilled, (state, action) => {
        const index = state.tweets.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tweets[index] = action.payload;
        }
        if (state.currentTweet?.id === action.payload.id) {
          state.currentTweet = action.payload;
        }
      });
  },
});

export const { clearReplies } = tweetSlice.actions;
export default tweetSlice.reducer;
