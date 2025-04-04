import React, { useState, useEffect } from "react";
import { fetchFavorites } from "../../../components/Mypage/favorite_videos/favoriteVidoesUtils";
import { createPlaylist, addVideoToPlaylist } from "./playlistUtils";
import SelectableVideoCard from "./SelectableVideoCard";

interface PlaylistEditDrawerProps {
  open: boolean;
  onClose: () => void;
  jwtToken: string;
  currentUser: {
    id: number;
    email: string;
    // 他に使うフィールドがあれば追加
  };
  onPlaylistCreated: (playlist: { id: number; name: string }) => void;
}

const PlaylistEditDrawer: React.FC<PlaylistEditDrawerProps> = ({
  open,
  onClose,
  jwtToken,
  currentUser,
  onPlaylistCreated,
}) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!jwtToken || !open) return;

    const load = async () => {
      try {
        const res = await fetchFavorites(1, "like", jwtToken, currentUser, 1000);
        if (res?.videos) {
          setVideos(res.videos);
        } else {
          console.warn("No videos returned");
          setVideos([]);
        }
      } catch (e) {
        console.error("お気に入り動画の取得に失敗しました", e);
        setVideos([]);
      }
    };

    load();
  }, [jwtToken, currentUser, open]);

  const toggleSelection = (videoId: number) => {
    setSelected((prev) =>
      prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId]
    );
  };

  const handleSubmit = async () => {
    if (!name || selected.length === 0) {
      alert("プレイリスト名と動画選択は必須です。");
      return;
    }

    try {
      const playlist = await createPlaylist(name, jwtToken);
      await Promise.all(
        selected.map((id) => addVideoToPlaylist(playlist.id, id, jwtToken))
      );
      onPlaylistCreated(playlist);
    } catch (err) {
      console.error("プレイリスト作成に失敗:", err);
      alert("プレイリストの作成に失敗しました。");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 w-full max-w-lg h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">新しいプレイリストを作成</h2>
      <input
        type="text"
        placeholder="プレイリスト名"
        className="w-full p-2 border rounded mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        {videos.map((video) => (
          <SelectableVideoCard
            key={video.id}
            video={video}
            selected={selected.includes(video.id)}
            onToggle={() => toggleSelection(video.id)}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          キャンセル
        </button>
        <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
          作成
        </button>
      </div>
    </div>
  );
};

export default PlaylistEditDrawer;
