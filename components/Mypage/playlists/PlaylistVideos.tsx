import React from "react";
import FavoriteVideoCard from "../favorite_videos/FavoriteVideoCard";
import { YoutubeVideo } from "../../../types/youtubeVideo"; // ← これに合わせて定義

// 各PlaylistItemの型（動画データ込み）
type PlaylistItem = {
  id: number;
  position: number;
  youtube_video: YoutubeVideo;
};

// propsの型
type Props = {
  playlistItems: PlaylistItem[];
  setPlaylistItems: React.Dispatch<React.SetStateAction<PlaylistItem[]>>;
  jwtToken: string;
  playlistId: number;
};

const PlaylistVideos: React.FC<Props> = ({
  playlistItems,
  setPlaylistItems,
  jwtToken,
  playlistId,
}) => {
  const moveVideo = (dragIndex: number, hoverIndex: number) => {
    const updated = [...playlistItems];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setPlaylistItems(updated);
  };

  const handleSaveOrder = async () => {
    const orderedIds = playlistItems.map((item) => item.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/items/sort`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ ordered_video_ids: orderedIds }),
        }
      );
      if (!res.ok) throw new Error("Failed to save order");
      console.log("並び順を保存しました");
    } catch (err) {
      console.error("並び順保存に失敗:", err);
    }
  };

  return (
    <div className="w-full px-6 py-8">
      {playlistId && (
        <button
          onClick={handleSaveOrder}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          並び順を保存する
        </button>
      )}
      {playlistItems.map((item, index) => (
        <FavoriteVideoCard
          key={item.id}
          index={index}
          video={item.youtube_video}
          notes={item.youtube_video.notes}
          currentUser={null}
          handleLikeVideo={() => { }}
          handleUnlikeVideo={() => { }}
          moveVideo={moveVideo}
        />
      ))}
    </div>
  );
};

export default PlaylistVideos;
