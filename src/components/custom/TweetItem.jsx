"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  HeartIcon,
  Repeat,
  MessageCircle,
  Share,
  Bookmark,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-toastify";

import { getUserById, setSelectedUserId } from "@/redux/Slices/authSlice";
import {
  deleteTweet,
  fetchLatestTweets,
  fetchUserTweets,
  likeTweet,
  retweetTweet,
} from "@/redux/Slices/tweetSlice";
import DeleteTweetDialog from "./DeleteTweetDialog";
import { createSlug } from "@/service/helpers";
import TweetDropdown from "./TweetDropdown";
import { Button } from "../ui/button";

function TweetItem({ tweet }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleTweetLike = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Tweet beğenebilmek için giriş yapmalısınız!");
      history.push("/login");
      return;
    }
    dispatch(likeTweet(id));
  };

  const handleRetweet = async (e, id) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Tweet RT yapabilmek için giriş yapmalısınız!");
      history.push("/login");
      return;
    }
    await dispatch(retweetTweet(id)).unwrap();
  };

  const handleDeleteTweet = async () => {
    try {
      await dispatch(deleteTweet(tweet.id)).unwrap();
      setIsDeleteDialogOpen(false);
      history.push("/tweets");
    } catch (error) {
      console.error("Tweet silme hatası:", error);
    }
  };

  const isOwner = user?.id === tweet?.userId;

  const handleProfileClick = (e, userFullName, userId) => {
    e.stopPropagation();
    history.push(`/profile/${createSlug(userFullName)}-${userId}`);
  };

  return (
    <div
      className="p-4 hover:bg-gray-900/50 transition-colors cursor-pointer border-b"
      onClick={() =>
        history.push(`/tweets/${createSlug(tweet.userFullName)}/${tweet.id}`, {
          tweet,
        })
      }
    >
      {tweet.tweetType === "RETWEET" && (
        <p className="text-sm text-gray-500 mb-2">
          <Repeat size={16} className="inline mr-2" />
          {tweet.userFullName} Retweetledi
        </p>
      )}

      <div className="flex gap-3">
        {/* Profil Resmi */}
        <div
          onClick={(e) =>
            handleProfileClick(
              e,
              tweet.tweetType === "RETWEET"
                ? tweet.originalUserFullName
                : tweet.userFullName,
              tweet.userId
            )
          }
          className="cursor-pointer flex-shrink-0"
        >
          <img
            src={
              tweet.tweetType === "RETWEET"
                ? tweet.originalUserProfileImage
                : tweet.userProfileImage
            }
            alt="Profile"
            className="w-10 h-10 rounded-full hover:opacity-80 transition-opacity"
          />
        </div>

        {/* Tweet İçeriği */}
        <div className="flex-1 min-w-0">
          {/* Kullanıcı Bilgisi */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <div className="flex flex-col  gap-2">
                <div className="flex gap-2 items-center">
                  <span
                    onClick={(e) =>
                      handleProfileClick(
                        e,
                        tweet.tweetType === "RETWEET"
                          ? tweet.originalUserFullName
                          : tweet.userFullName,
                        tweet.userId
                      )
                    }
                    className="font-bold hover:underline cursor-pointer"
                  >
                    {tweet.tweetType === "RETWEET"
                      ? tweet.originalUserFullName
                      : tweet.userFullName}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(tweet.createdAt).toLocaleDateString()}-
                    {new Date(tweet.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <span className="text-gray-500">@{tweet.username}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TweetDropdown
                isOwner={isOwner}
                onDelete={() => setIsDeleteDialogOpen(true)}
                username={tweet.username}
              />
            </div>
          </div>

          {/* Tweet Metni */}
          <div className="py-4">
            <p className="text-gray-300 mt-1">{tweet.content}</p>

            {/* Tweet Görseli */}
            {tweet.mediaUrl && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img
                  src={tweet.mediaUrl || "/placeholder.svg"}
                  alt="Tweet görseli"
                  className="w-96 h-auto max-h-[550px] object-cover"
                />
              </div>
            )}
          </div>
          {/* Etkileşim Butonları */}
          <div className="flex justify-between  items-center mt-3 text-gray-500 ">
            <button
              onClick={(e) => handleTweetLike(e, tweet.id)}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500">
                <HeartIcon
                  size={18}
                  className={tweet.liked ? "fill-red-500 text-red-500" : ""}
                />
              </div>
              <span
                className={
                  tweet.liked ? "text-red-500" : "group-hover:text-red-500"
                }
              >
                {tweet.likeCount}
              </span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                <MessageCircle size={18} />
              </div>
              <span className="group-hover:text-blue-500">
                {tweet.replyCount}
              </span>
            </button>

            <button
              onClick={(e) => handleRetweet(e, tweet.id)}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500">
                <Repeat
                  size={18}
                  className={tweet.retweeted ? "text-green-500" : ""}
                />
              </div>
              <span
                className={
                  tweet.retweeted
                    ? "text-green-500"
                    : "group-hover:text-green-500"
                }
              >
                {tweet.retweetCount}
              </span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                <Share size={18} />
              </div>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                <Bookmark size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetItem;
