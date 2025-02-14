import { followUser, unfollowUser } from "@/redux/Slices/followSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";

function FollowButton({ userId }) {
  const dispatch = useDispatch();
  const { isFollowing, loading } = useSelector((state) => state.follow);

  const handleFollowAction = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userId));
    } else {
      dispatch(followUser(userId));
    }
  };

  return (
    <Button
      onClick={handleFollowAction}
      disabled={loading}
      variant={isFollowing ? "outline" : "default"}
      className="rounded-full"
    >
      {isFollowing ? "Takibi Bırak" : "Takip Et"}
    </Button>
  );
}

export default FollowButton;
