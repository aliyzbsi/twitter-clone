"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TweetComposer from "./TweetComposer";
import TweetItem from "./TweetItem";
import { fetchUserTweets } from "@/redux/Slices/tweetSlice";
import { clearProfileUser, getUserById } from "@/redux/Slices/authSlice";
import { checkFollowStatus } from "@/redux/Slices/followSlice";
import FollowButton from "./FollowButton";
import FollowersModal from "./FollowersModal";

function UserProfile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userName, id } = useParams();
  const {
    isAuthenticated,
    user,

    profileUser,
    loading: userLoading,
  } = useSelector((state) => state.auth);
  const { userTweet, loading: tweetLoading } = useSelector(
    (state) => state.tweet
  );
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const { isFollowing } = useSelector((state) => state.follow);

  useEffect(() => {
    if (id) {
      // Redux state'inde userId varsa direkt kullan
      dispatch(getUserById(id)).then((action) => {
        if (action.payload?.id) {
          dispatch(fetchUserTweets(id));
          dispatch(checkFollowStatus(id));
        }
      });
    }
    return () => {
      dispatch(clearProfileUser());
    };
  }, [dispatch, id]);

  if (userLoading || !profileUser) {
    return (
      <div className="p-4 text-center text-white">Kullanıcı yükleniyor...</div>
    );
  }

  const isOwnProfile = isAuthenticated && user?.id === profileUser.id;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-black/80 backdrop-blur-sm p-4 border-b border-gray-800">
        <button
          onClick={() => history.goBack()}
          className="rounded-full p-2 hover:bg-gray-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold">{profileUser.firstAndLastName}</h1>
          <p className="text-sm text-gray-500">
            {userTweet?.length || 0} gönderi
          </p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative">
        {/* Banner */}
        <div className="h-80 bg-gray-800">
          {profileUser.headerImage && (
            <img
              src={profileUser.headerImage || "/placeholder.svg"}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Avatar */}
        <div className="absolute bottom-6 left-4">
          <img
            src={profileUser.profileImage || "/placeholder.svg"}
            alt={profileUser.firstAndLastName}
            className="w-24 h-24 rounded-full border-4 border-black"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end p-4">
          {isOwnProfile ? (
            <button className="border border-gray-600 px-4 py-1.5 rounded-full hover:bg-gray-900 transition-colors">
              Profili Düzenle
            </button>
          ) : (
            <FollowButton userId={profileUser.id} />
          )}
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4  pb-4">
        <h2 className="text-xl font-bold">{profileUser.firstAndLastName}</h2>
        <p className="text-gray-500">@{profileUser.username}</p>

        {profileUser.bio && (
          <p className="mt-2 text-gray-300">{profileUser.bio}</p>
        )}

        <div className="flex gap-4 mt-3">
          <button
            onClick={() => setShowFollowingModal(true)}
            className="hover:underline"
          >
            <span className="font-bold">{profileUser.followingCount || 0}</span>{" "}
            <span className="text-gray-500">Takip edilen</span>
          </button>
          <button
            onClick={() => setShowFollowersModal(true)}
            className="hover:underline"
          >
            <span className="font-bold">{profileUser.followersCount || 0}</span>{" "}
            <span className="text-gray-500">Takipçi</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <Tabs defaultValue="tweets" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-transparent">
            <TabsTrigger
              value="tweets"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Gönderiler
            </TabsTrigger>
            <TabsTrigger
              value="replies"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Yanıtlar
            </TabsTrigger>
            <TabsTrigger
              value="media"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Medya
            </TabsTrigger>
            <TabsTrigger
              value="likes"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
            >
              Beğeni
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tweets */}
      <div className="divide-y divide-gray-800">
        {isOwnProfile && <TweetComposer />}
        {tweetLoading ? (
          <div className="p-4 text-center">Tweetler yükleniyor...</div>
        ) : userTweet?.length > 0 ? (
          userTweet.map((tweet) => (
            <div key={tweet.id} className="border-b border-gray-800">
              <TweetItem tweet={tweet} />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">Henüz gönderi yok</div>
        )}
      </div>
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        userId={profileUser.id}
        type="followers"
      />
      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        userId={profileUser.id}
        type="following"
      />
    </div>
  );
}

export default UserProfile;
