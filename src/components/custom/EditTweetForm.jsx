"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateTweet } from "@/redux/Slices/tweetSlice";

export function EditTweetForm({ tweet, onClose }) {
  const [content, setContent] = useState(tweet.content);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateTweet({ tweetId: tweet.id, tweetData: { content } })
      ).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update tweet:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tweet içeriğini düzenle"
        className="w-full bg-black p-2 text-lg border rounded-md"
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button type="submit">Güncelle</Button>
      </div>
    </form>
  );
}
