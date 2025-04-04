// components/Mypage/playlists/EditPlaylistDrawer.tsx

import React, { useEffect, useState } from "react";
import { fetchFavorites } from "../favorite_videos/favoriteVidoesUtils";
import { updatePlaylistItems } from "./playlistUtils";
import SelectableVideoCard from "./SelectableVideoCard";
import { YoutubeVideo } from "../../../types/youtubeVideo";

interface EditPlaylistDrawerProps {
  open: boolean;
  onClose: () => void;
  jwtToken: string;
  playlistId: number;
  currentVideos: number[]; // 現在の動画ID一覧
  onUpdated: (updatedIds: number[]) => void;
}

const EditPlaylistDrawer: React.FC<EditPlaylistDrawerProps> = ({
  open,
  onClose,
  jwtToken,
  playlistId,
  currentVideos,
  onUpdated
}) => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!open || !jwtToken) return;

    const loadFavorites = async () => {
      try {
        const res = await fetchFavorites(1, "like", jwtToken, null, 1000);

        if (res && res.videos) {
          setVideos(res.videos);
        } else {
          setVideos([]);
        }

        setSelected(currentVideos);
      } catch (err) {
        console.error("いいね動画の取得失敗:", err);
        setVideos([]);
      }
    };

    loadFavorites();
  }, [open, jwtToken]);

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      await updatePlaylistItems(playlistId, selected, jwtToken);
      onUpdated(selected);
      onClose();
    } catch (err) {
      console.error("更新失敗:", err);
      alert("更新に失敗しました。");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-5xl bg-white shadow-lg z-50 flex flex-col pt-16 pb-24 px-6">
      <h2 className="text-xl font-bold mb-4">プレイリストの編集</h2>

      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {videos.map((video) => (
            <SelectableVideoCard
              key={video.id}
              video={video}
              selected={selected.includes(video.id)}
              onToggle={() => toggleSelection(video.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          キャンセル
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          保存
        </button>
      </div>
    </div>
  );
};

export default EditPlaylistDrawer;
