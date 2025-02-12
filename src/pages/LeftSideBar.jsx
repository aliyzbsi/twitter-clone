import { Button } from "@/components/ui/button";
import { getCurrentUser, logout } from "@/redux/Slices/authSlice";
import { createSlug } from "@/service/helpers";
import {
  Bell,
  Bookmark,
  Home,
  Mail,
  Search,
  Twitter,
  User,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";

const navigation = [
  { name: "Anasayfa", to: "/tweets", icon: Home },
  { name: "Keşfet", to: "/explore", icon: Search },
  { name: "Bildirimler", to: "/notifications", icon: Bell },
  { name: "Mesajlar", to: "/messages", icon: Mail },
  { name: "Yer İşaretleri", to: "/bookmarks", icon: Bookmark },
];
function LeftSideBar() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const logOut = () => {
    dispatch(logout());
  };
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <div className="w-96   h-screen border-r border-gray-800 bg-black text-white p-2">
      <div className="p-4 fixed flex flex-col  h-full justify-between">
        <nav className="space-y-2">
          <Twitter className="w-8 h-8 text-white mb-4" />
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center gap-4 py-3 text-xl hover:bg-gray-900 rounded-full transition-colors  ${
                location.pathname === item.to ? "font-bold" : ""
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.name}
            </Link>
          ))}
        </nav>
        {isAuthenticated ? (
          <div key={user.id} className="flex flex-col gap-4">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() =>
                history.push(
                  `/profile/${createSlug(user.firstAndLastName)}-${user.id}`
                )
              }
            >
              <img
                src={user.profileImage}
                alt=""
                className="w-12 h-12 rounded-full"
              />
              <p>{user.firstAndLastName}</p>
            </div>
            <button
              className="p-2 px-4 rounded-2xl border-2 border-gray-800 hover:bg-white hover:text-black"
              onClick={() => logOut()}
            >
              Çıkış Yap
            </button>
          </div>
        ) : (
          <div className="p-2 flex flex-col gap-4  ">
            <button
              className="p-2 px-4 border-2 border-white-800 rounded-2xl hover:bg-white hover:text-black"
              onClick={() => history.push("/login")}
            >
              Giriş
            </button>
            <button
              className="p-2 px-4 border-2 border-white-800 rounded-2xl hover:bg-white hover:text-black"
              onClick={() => history.push("/register")}
            >
              Kayıt ol
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LeftSideBar;
