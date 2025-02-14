import { getFollowers, getFollowing } from "@/redux/Slices/followSlice";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import FollowButton from "./FollowButton";
import { createSlug } from "@/service/helpers";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function FollowersModal({ isOpen, onClose, userId, type }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { followers, followings } = useSelector((state) => state.follow);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isOpen) {
      if (type === "followers") {
        dispatch(getFollowers(userId));
      } else {
        dispatch(getFollowing(userId));
      }
    }
  }, [isOpen, userId, type, dispatch]);

  const users = type === "followers" ? followers : followings;
  const title = type === "followers" ? "Takipçiler" : "Takip Edilenler";
  const description =
    type === "followers"
      ? "Bu kullanıcıyı takip eden kişilerin listesi"
      : "Bu kullanıcının takip ettiği kişilerin listesi";

  const handleProfileClick = (e, userFullName, userId) => {
    e.stopPropagation();
    onClose();
    setTimeout(() => {
      history.push(`/profile/${createSlug(userFullName)}-${userId}`);
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto ">
          {users.length > 0 ? (
            users.map((followUser) => (
              <div
                key={followUser.id}
                className="flex items-center justify-between p-2"
              >
                <div
                  className="flex items-center gap-3 hover:underline cursor-pointer"
                  onClick={(e) =>
                    handleProfileClick(e, followUser.username, followUser.id)
                  }
                >
                  <Avatar>
                    <AvatarImage
                      src={followUser.profileImage}
                      alt={followUser.username}
                      className="w-24 h-24 rounded-full"
                    />
                    <AvatarFallback>{followUser.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{followUser.fullName}</p>
                    <p className="text-base font-semibold text-gray-500">
                      {followUser.firstAndLastName}
                    </p>
                  </div>
                </div>
                {followUser.id !== user?.id && (
                  <FollowButton userId={followUser.id} />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              {type === "followers"
                ? "Henüz takipçi yok"
                : "Henüz takip edilen kullanıcı yok"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FollowersModal;
