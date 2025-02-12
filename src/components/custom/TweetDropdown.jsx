import {
  MoreHorizontal,
  Trash2,
  UserMinus,
  Pin,
  ListPlus,
  LogOut,
  BarChart2,
  Code2,
  Activity,
  Flag,
  Mail,
  RectangleVertical,
  Square,
  SquarePen,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

export default function TweetDropdown({ isOwner, onDelete, onEdit, username }) {
  const handleDelete = () => {
    onDelete();
  };

  const handleUpdate = () => {
    onEdit();
  };

  const handlePinProfile = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleRemoveFromProfile = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleAddToList = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleLeaveConversation = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleViewEngagement = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleEmbedTweet = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleViewStats = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleReport = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  const handleMessage = () => {
    toast.info("Bu özellik henüz aktif değil");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full p-2 hover:bg-gray-800">
          <MoreHorizontal size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 bg-black border border-gray-800"
      >
        {isOwner ? (
          <>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer gap-3 py-3"
            >
              <Trash2 size={18} />
              <span>Sil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUpdate}
              className="text-blue-500 hover:text-blue-600 hover:bg-red-500/10 cursor-pointer gap-3 py-3"
            >
              <SquarePen size={18} />
              <span>Düzenle</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleRemoveFromProfile}
              className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
            >
              <UserMinus size={18} />
              <span>Profilden ayır</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handlePinProfile}
              className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
            >
              <Pin size={18} />
              <span>Profilinde öne çıkar</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={handleReport}
              className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
            >
              <Flag size={18} />
              <span>Gönderiyi şikayet et</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleMessage}
              className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
            >
              <Mail size={18} />
              <span>@{username} kullanıcısına mesaj gönder</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem
          onClick={handleAddToList}
          className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
        >
          <ListPlus size={18} />
          <span>Listelere ekle / listelerden kaldır</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLeaveConversation}
          className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
        >
          <LogOut size={18} />
          <span>Sohbetten ayrıl</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleViewEngagement}
          className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
        >
          <Activity size={18} />
          <span>Gönderi etkileşimlerini görüntüle</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleEmbedTweet}
          className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
        >
          <Code2 size={18} />
          <span>Gönderi öğesini yerleştir</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleViewStats}
          className="text-white hover:bg-gray-800 cursor-pointer gap-3 py-3"
        >
          <BarChart2 size={18} />
          <span>Gönderi istatistiklerini görüntüle</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
