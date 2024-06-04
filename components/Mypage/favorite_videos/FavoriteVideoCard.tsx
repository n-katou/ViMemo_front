import React from 'react';
import { useRouter } from 'next/navigation';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import NoteIcon from '@mui/icons-material/Note';
import { formatDuration } from '../../YoutubeShow/youtubeShowUtils'; // 動画の再生時間をフォーマットする関数をインポート

// VideoCardコンポーネントのプロパティ型を定義
interface VideoCardProps {
  video: YoutubeVideo; // 表示する動画のデータ
  currentUser: any; // 現在のユーザー情報
  handleLikeVideo: (id: number) => void; // いいねクリック時のハンドラ
  handleUnlikeVideo: (id: number, likeId: number | undefined) => void; // いいね解除クリック時のハンドラ
}

// VideoCardコンポーネントを定義
const VideoCard: React.FC<VideoCardProps> = ({ video, currentUser, handleLikeVideo, handleUnlikeVideo }) => {
  const router = useRouter();

  return (
    <div key={video.id} className="bg-white shadow-lg rounded-lg overflow-hidden youtube-video-card group">
      <div className="video-container relative"> {/* 動画のアスペクト比を維持するためのコンテナ */}
        <iframe
          className="video absolute top-0 left-0 w-full h-full" // フレームを絶対位置に配置
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <div className="p-4"> {/* カードのコンテンツ部分 */}
        <h2
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline group-hover:text-blue-700"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
        >
          {video.title}
        </h2>
        <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p className="text-gray-600">動画時間: {formatDuration(video.duration)}</p>
        <div className="flex items-center">
          <FavoriteIcon className="text-red-500 mr-1" />
          <p className="text-gray-600">{video.likes_count}</p>
        </div>
        <div className="flex items-center">
          <NoteIcon className="text-blue-500 mr-1" />
          <p className="text-gray-600">{video.notes_count}</p>
        </div>
        <div className="flex items-center mt-2">
          {video.liked ? ( // 動画がいいねされている場合
            <Tooltip title="いいね解除">
              <div className="flex items-center cursor-pointer" onClick={async () => {
                if (currentUser && video.likeId) { // 現在のユーザーが存在し、いいねIDがある場合
                  await handleUnlikeVideo(video.id, video.likeId); // いいね解除の処理を呼び出す
                }
              }}>
                <IconButton color="secondary" className="like-button">
                  <FavoriteIcon style={{ color: 'red' }} /> {/* いいね済みアイコン */}
                </IconButton>
                <span style={{ color: 'black' }}>いいね解除</span> {/* いいね解除のラベル */}
              </div>
            </Tooltip>
          ) : ( // 動画がいいねされていない場合
            <Tooltip title="いいね">
              <div className="flex items-center cursor-pointer" onClick={async () => {
                await handleLikeVideo(video.id); // いいねの処理を呼び出す
              }}>
                <IconButton color="primary" className="like-button">
                  <FavoriteBorderIcon /> {/* いいねアイコン */}
                </IconButton>
                <span style={{ color: 'black' }}>いいねする</span> {/* いいねのラベル */}
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
