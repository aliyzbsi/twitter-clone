import { useState } from "react";
import { useForm } from "react-hook-form";
import { ImageIcon, X, Smile, MapPin, Calendar } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { replyTweet } from "@/redux/Slices/tweetSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function ReplyComposer({ targetTweet }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const maxLength = 280;
  const history = useHistory();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content: "",
      mediaUrl: null,
    },
  });

  const content = watch("content");
  const remainingChars = maxLength - (content?.length || 0);
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 20;

  const handleImageClick = () => {
    setIsUrlDialogOpen(true);
  };

  const validateImageUrl = (url) => {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/i;
    return urlPattern.test(url);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast.error("Lütfen bir resim URL'si girin");
      return;
    }

    if (!validateImageUrl(imageUrl)) {
      toast.error("Lütfen geçerli bir resim URL'si girin (jpg, png, gif vb.)");
      return;
    }

    setValue("mediaUrl", imageUrl);
    setPreviewImage(imageUrl);
    setIsUrlDialogOpen(false);
    setImageUrl("");
  };

  const removeImage = () => {
    setValue("mediaUrl", null);
    setPreviewImage(null);
    setImageUrl("");
  };

  const onSubmit = async (data) => {
    if (isOverLimit) return;

    // Tweet ID kontrolü
    const parentId = targetTweet?.id;
    if (!parentId) {
      toast.error("Yanıt gönderilemedi: Tweet ID bulunamadı");
      return;
    }

    setIsLoading(true);
    try {
      const tweetData = {
        content: data.content.trim(),
        parentTweetId: parentId,
        mediaUrl: data.mediaUrl,
        mediaType: data.mediaUrl ? "IMAGE" : "NONE",
      };

      if (!tweetData.content) {
        toast.error("Yanıt içeriği boş olamaz");
        return;
      }
      if (!isAuthenticated) {
        toast.error("Yanıt vermek için giriş yapmanız gerekiyor!");
        history.push("/login");
      } else {
        await dispatch(
          replyTweet({
            parentTweetId: parentId,
            tweetData,
          })
        ).unwrap();

        reset();
        removeImage();
      }
    } catch (error) {
      console.error("Yanıt gönderme hatası:", error);
      toast.error(error?.message || "Yanıt gönderilirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-black">
        <div className="flex gap-4">
          <img
            src={user?.profileImage || "/placeholder.svg"}
            alt="Profil"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              {...register("content", {
                required: "Yanıt içeriği boş olamaz",
                maxLength: {
                  value: maxLength,
                  message: `Yanıt en fazla ${maxLength} karakter olabilir`,
                },
              })}
              placeholder="Yanıtını gönder"
              className="w-full bg-transparent border-none outline-none text-xl resize-none text-white placeholder-gray-600 min-h-[50px]"
              rows={1}
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />

            {previewImage && (
              <div className="relative mt-2">
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Yanıt görseli"
                  className="rounded-2xl max-h-[300px] object-contain bg-gray-900"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    toast.error("Resim yüklenemedi");
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/75 text-white rounded-full"
                  onClick={removeImage}
                >
                  <X size={20} />
                </Button>
              </div>
            )}

            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 text-blue-500">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10"
                  onClick={handleImageClick}
                  aria-label="Resim ekle"
                >
                  <ImageIcon size={20} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10"
                  aria-label="Emoji ekle"
                >
                  <Smile size={20} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10"
                  aria-label="Konum ekle"
                >
                  <MapPin size={20} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-blue-500/10"
                  aria-label="Takvim ekle"
                >
                  <Calendar size={20} />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                {content?.length > 0 && (
                  <span
                    className={`text-sm ${
                      isOverLimit
                        ? "text-red-500"
                        : isNearLimit
                        ? "text-yellow-500"
                        : "text-gray-500"
                    }`}
                  >
                    {remainingChars}
                  </span>
                )}
                <Button
                  type="submit"
                  disabled={isLoading || isOverLimit || !content?.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 font-bold disabled:opacity-50"
                >
                  {isLoading ? "Gönderiliyor..." : "Yanıtla"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>

      <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resim URL'si Ekle</DialogTitle>
            <DialogDescription>
              Paylaşmak istediğiniz resmin internet adresini girin. Desteklenen
              formatlar: JPG, PNG, GIF, WebP, AVIF, SVG
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="imageUrl"
                placeholder="https://ornek.com/resim.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <div className="relative mt-2 bg-gray-900 rounded-md overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Önizleme"
                    className="max-h-[200px] w-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      toast.error("Resim yüklenemedi");
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUrlDialogOpen(false)}
              >
                İptal
              </Button>
              <Button onClick={handleUrlSubmit}>Ekle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
