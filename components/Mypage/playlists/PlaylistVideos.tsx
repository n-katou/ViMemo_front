import React from "react";
import FavoriteVideoCard from "../favorite_videos/FavoriteVideoCard";

const PlaylistVideos = ({ playlistItems }: { playlistItems: any[] }) => {
  return (
    <div className="w-3/4 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">プレイリストの動画</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlistItems.map((item, index) => (
          <FavoriteVideoCard
            key={item.youtube_video.id}
            video={{
              ...item.youtube_video,
              liked: true,
              likeId: item.id,
              notes: item.notes || [],
            }}
            index={index}
            currentUser={null}
            handleLikeVideo={() => { }}
            handleUnlikeVideo={() => { }}
            moveVideo={() => { }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistVideos;
