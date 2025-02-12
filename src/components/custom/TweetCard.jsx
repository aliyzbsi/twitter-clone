import { useHistory } from "react-router-dom";
import {
  HeartIcon,
  MessageCircle,
  Repeat,
  Share,
  Bookmark,
} from "../custom/icons";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import DeleteTweetDialog from "./DeleteTweetDialog";
import { useDispatch } from "react-redux";
import { deleteTweet } from "@/redux/Slices/tweetSlice";

const TweetCard = ({
  tweet,
  handleTweetLike,
  handleRetweet,
  isReply = false,
  currentUser,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const timeAgo = "10 mins ago"; // Replace with actual time ago calculation

  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "")
      .replace(/^-+|-+$/g, "");
  };

  const handleDeleteTweet = async () => {
    try {
      await dispatch(deleteTweet(tweet.id)).unwrap();
      if (isReply) {
        // Yanıtsa sayfada kal, sadece yanıtı kaldır
        setIsDeleteDialogOpen(false);
      } else {
        // Ana tweet ise anasayfaya yönlendir
        history.push("/");
      }
    } catch (error) {
      console.error("Tweet silme hatası:", error);
    }
  };

  const isOwner =
    currentUser?.username ===
    (tweet.tweetType === "RETWEET" ? tweet.originalUsername : tweet.username);

  return (
    <>
      <div
        className="p-4 cursor-pointer"
        onClick={() =>
          history.push(`/tweets/${createSlug(tweet.userFullName)}/${tweet.id}`)
        }
      >
        <div className="flex gap-4">
          <img
            src={tweet.userProfileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold hover:underline">
                  {tweet.userFullName}
                </span>
                <span className="text-gray-500 text-sm">@{tweet.username}</span>
                <span className="text-gray-500 text-sm">· {timeAgo}</span>
              </div>
              {isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteDialogOpen(true);
                  }}
                  className="p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <p className="mt-2 text-[15px] text-gray-200">{tweet.content}</p>

            {tweet.mediaUrl && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img
                  src={tweet.mediaUrl || "/placeholder.svg"}
                  alt="Tweet görseli"
                  className="w-full h-auto max-h-[512px] object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-3 max-w-md">
              <button
                onClick={handleTweetLike}
                className="group flex items-center gap-2 text-gray-500"
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

              <button className="group flex items-center gap-2 text-gray-500">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                  <MessageCircle size={18} />
                </div>
                <span className="group-hover:text-blue-500">
                  {tweet.replyCount}
                </span>
              </button>

              <button
                onClick={handleRetweet}
                className="group flex items-center gap-2 text-gray-500"
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

              <button className="group flex items-center gap-2 text-gray-500">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                  <Share size={18} />
                </div>
              </button>

              <button className="group flex items-center gap-2 text-gray-500">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
                  <Bookmark size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteTweetDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTweet}
      />
    </>
  );
};

export default TweetCard;
