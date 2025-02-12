"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TweetComposer from "./TweetComposer";

import {
  deleteTweet,
  fetchTweets,
  likeTweet,
  retweetTweet,
} from "@/redux/Slices/tweetSlice";
import DeleteTweetDialog from "./DeleteTweetDialog";

import { getCurrentUser } from "@/redux/Slices/authSlice";
import TweetItem from "./TweetItem";

function Tweet() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { tweets, loading } = useSelector((state) => state.tweet);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTweetId, setSelectedTweetId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTweets());
  }, [dispatch]);

  const handleDeleteTweet = async () => {
    try {
      await dispatch(deleteTweet(selectedTweetId)).unwrap();
      setIsDeleteDialogOpen(false);
      history.push("/tweets");
    } catch (error) {
      console.error("Tweet silme hatası:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tabs */}
      <div className="border-b border-gray-800 sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-transparent">
            <TabsTrigger
              value="for-you"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Sana özel
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Takip
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tweet Composer */}
      <TweetComposer />

      {/* Tweets */}
      <div className="divide-y divide-gray-800">
        {loading ? (
          <div className="p-4 text-center">Yükleniyor...</div>
        ) : (
          tweets?.map((tweet) => <TweetItem key={tweet.id} tweet={tweet} />)
        )}
      </div>

      {/* Silme Dialog'u */}
      <DeleteTweetDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTweet}
      />
    </div>
  );
}

export default Tweet;
