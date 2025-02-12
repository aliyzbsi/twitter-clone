import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  HeartIcon,
  Repeat,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  Trash2,
  Edit,
} from "lucide-react";
import { toast } from "react-toastify";

import ReplyComposer from "./ReplyComposer";
import ReplyForTweet from "./ReplyForTweet";
import DeleteTweetDialog from "./DeleteTweetDialog";
import TweetDropdown from "./TweetDropdown";
import {
  deleteTweet,
  fetchTweetByID,
  likeTweet,
  retweetTweet,
  updateTweet,
} from "../../redux/Slices/tweetSlice";
import { Button } from "../ui/button";
import { EditTweetForm } from "./EditTweetForm";

function TweetContent() {
  const { tweetId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    currentTweet: targetTweet,
    loading,
    error,
  } = useSelector((state) => state.tweet);
  const { user } = useSelector((state) => state.auth);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Fetch tweet data
  useEffect(() => {
    if (tweetId) {
      dispatch(fetchTweetByID(tweetId));
    }
  }, [dispatch, tweetId]);

  // Handle retweet redirect
  useEffect(() => {
    if (targetTweet?.tweetType === "RETWEET" && targetTweet?.parentTweetID) {
      history.replace(
        `/tweets/${targetTweet.originalUserName}/${targetTweet.parentTweetID}`
      );
    }
  }, [targetTweet, history]);

  const handleTweetLike = async (id) => {
    if (!isAuthenticated) {
      toast.error("Tweet beğenebilmek için giriş yapmalısınız!");
      history.push("/login");
      return;
    }
    dispatch(likeTweet(id));
  };

  const handleRetweet = async (id) => {
    if (!isAuthenticated) {
      toast.error("Retweet yapabilmek için giriş yapmalısınız!");
      history.push("/login");
      return;
    }
    try {
      await dispatch(retweetTweet(id)).unwrap();
    } catch (error) {
      console.error("Retweet error:", error);
    }
  };

  const handleDeleteTweet = async () => {
    try {
      await dispatch(deleteTweet(targetTweet.id)).unwrap();
      history.push("/tweets");
    } catch (error) {
      console.error("Tweet silme hatası:", error);
    }
  };

  const handleUpdateTweet = async (id, data) => {
    try {
      await dispatch(updateTweet(id, data)).unwrap();
      console.log("update için gönderilen id:", id);
      console.log("update data:", data);
    } catch (error) {
      console.error("Tweet silme hatası:", error);
    }
  };
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
  };
  if (loading) {
    return <div className="p-4 text-white">Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Bir hata oluştu: {error.message}</div>
    );
  }

  if (!targetTweet) {
    return <div className="p-4 text-white">Tweet bulunamadı</div>;
  }

  // Safe isOwner check
  const isOwner =
    user?.username &&
    (targetTweet.tweetType === "RETWEET"
      ? user.username === targetTweet.originalUsername
      : user.username === targetTweet.username);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-gray-800 bg-black/80 backdrop-blur-sm p-4">
        <button
          onClick={() => history.goBack()}
          className="rounded-full p-2 hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Gönderi</h1>
      </div>

      {/* Tweet Content */}
      <div className="border-b border-gray-800">
        {/* Tweet Header */}
        <div className="flex items-start justify-between p-4">
          <div className="flex gap-3">
            <img
              src={targetTweet.userProfileImage || "/placeholder.svg"}
              alt={targetTweet.userFullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center gap-1">
                <p className="font-bold hover:underline">
                  {targetTweet.userFullName}
                </p>
                {targetTweet.verified && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
              <p className="text-gray-500">@{targetTweet.username}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <div>
                <button
                  onClick={handleEditClick}
                  className="rounded-full p-2 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="rounded-full p-2 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="rounded-full bg-white text-black hover:bg-gray-200"
              >
                <span
                  onClick={() => handleUpdateTweet(targetTweet.id, targetTweet)}
                >
                  Takip et
                </span>
              </Button>
            )}
            <TweetDropdown
              isOwner={isOwner}
              onDelete={() => setIsDeleteDialogOpen(true)}
              onEdit={handleEditClick}
              username={targetTweet.username}
            />
          </div>
        </div>

        {/* Tweet Body */}
        <div className="px-4 pb-3">
          {isEditing ? (
            <EditTweetForm tweet={targetTweet} onClose={handleEditClose} />
          ) : (
            <>
              <p className="text-xl whitespace-pre-wrap">
                {targetTweet.content}
              </p>
              {targetTweet.mediaUrl && (
                <div className="mt-3 rounded-xl overflow-hidden">
                  <img
                    src={targetTweet.mediaUrl || "/placeholder.svg"}
                    alt="Tweet görseli"
                    className="w-full h-auto max-h-[512px] object-cover"
                  />
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-4 text-gray-500 mt-4">
            <span>{new Date(targetTweet.createdAt).toLocaleTimeString()}</span>
            <span>·</span>
            <span>{new Date(targetTweet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Engagement Stats */}
        {(targetTweet.retweetCount > 0 || targetTweet.likeCount > 0) && (
          <div className="flex gap-5 px-4 py-3 border-y border-gray-800">
            {targetTweet.retweetCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold">{targetTweet.retweetCount}</span>
                <span className="text-gray-500">Retweet</span>
              </div>
            )}
            {targetTweet.likeCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="font-bold">{targetTweet.likeCount}</span>
                <span className="text-gray-500">Beğeni</span>
              </div>
            )}
          </div>
        )}

        {/* Engagement Buttons */}
        <div className="flex justify-around items-center py-2 px-4 border-b border-gray-800">
          <button className="group flex items-center gap-2 text-gray-500">
            <div className="p-2 rounded-full flex items-center gap-2 group-hover:bg-blue-500/10 group-hover:text-blue-500">
              <MessageCircle size={20} />
              <span>{targetTweet.replyCount}</span>
            </div>
          </button>

          <button
            onClick={() => handleRetweet(targetTweet.id)}
            className={`group flex items-center gap-2 ${
              targetTweet.retweeted ? "text-green-500" : "text-gray-500"
            }`}
          >
            <div className="p-2 rounded-full flex items-center gap-2 group-hover:bg-green-500/10 group-hover:text-green-500">
              <Repeat size={20} />
              <span>{targetTweet.retweetCount}</span>
            </div>
          </button>

          <button
            onClick={() => handleTweetLike(targetTweet.id)}
            className={`group flex items-center gap-2 ${
              targetTweet.liked ? "text-red-500" : "text-gray-500"
            }`}
          >
            <div className="p-2 rounded-full flex items-center gap-2 group-hover:bg-red-500/10 group-hover:text-red-500">
              <HeartIcon
                size={20}
                className={targetTweet.liked ? "fill-current" : ""}
              />
              <span>{targetTweet.likeCount}</span>
            </div>
          </button>

          <button className="group flex items-center gap-2 text-gray-500">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
              <Bookmark size={20} />
            </div>
          </button>

          <button className="group flex items-center gap-2 text-gray-500">
            <div className="p-2 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500">
              <Share size={20} />
            </div>
          </button>
        </div>
      </div>

      {/* Reply Box */}
      <ReplyComposer targetTweet={targetTweet} />

      {/* Replies */}
      <div className="border-t border-gray-800">
        <ReplyForTweet tweetId={targetTweet.id} />
      </div>

      <DeleteTweetDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTweet}
      />
    </div>
  );
}

export default TweetContent;
