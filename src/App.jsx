import { Route, Switch } from "react-router-dom";

import Tweet from "./components/custom/Tweet";
import Login from "./components/custom/Login";
import ProtectedRoute from "./components/custom/ProtectedRoute";
import TweetContent from "./components/custom/TweetContent";
import UserProfile from "./components/custom/UserProfile";

import PageContent from "./layout/PageContent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./redux/Slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);
  return (
    <Switch>
      <PageContent>
        <Switch>
          <ProtectedRoute exact path="/" component={Tweet} />

          <Route exact path="/login" component={Login} />

          <ProtectedRoute exact path="/tweets" component={Tweet} />

          <Route path="/tweets/:userName/:tweetId" component={TweetContent} />
          <Route path="/profile/:userName-:id" component={UserProfile} />
        </Switch>
      </PageContent>
    </Switch>
  );
}

export default App;
