"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import TweetCard from "./TweetCard";
import {
  clearReplies,
  fetchReplyTweetsForParentTweet,
} from "@/redux/Slices/tweetSlice";

export default function ReplyForTweet({ tweetId }) {
  const dispatch = useDispatch();
  const { replies, repliesLoading, repliesError } = useSelector(
    (state) => state.tweet
  );

  useEffect(() => {
    if (tweetId) {
      dispatch(fetchReplyTweetsForParentTweet(tweetId));
    }

    return () => {
      dispatch(clearReplies());
    };
  }, [dispatch, tweetId]);

  if (repliesLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (repliesError) {
    return (
      <div className="p-4 text-red-500 bg-red-500/10 rounded-lg m-4">
        <p className="font-medium">Yanıtlar yüklenirken bir hata oluştu</p>
        <p className="text-sm mt-1">{repliesError.message}</p>
      </div>
    );
  }

  if (!replies?.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-lg">Henüz yanıt yok</p>
        <p className="text-sm mt-2">Bu tweet'e ilk yanıt veren sen ol!</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-800">
      {replies.map((reply) => (
        <div key={reply.id} className="hover:bg-gray-900/50 transition-colors">
          <TweetCard tweet={reply} isReply={true} />
        </div>
      ))}
    </div>
  );
}
