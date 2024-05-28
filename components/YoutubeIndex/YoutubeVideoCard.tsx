import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Like } from '../../types/like';
import { useAuth } from '../../context/AuthContext'; // 認証コンテキストをインポート
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import NoteIcon from '@mui/icons-material/Note';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { formatDuration } from '../YoutubeShow/youtubeShowUtils'; // 動画の再生時間をフォーマットする関数をインポート

// YoutubeVideoCardコンポーネントのプロパティ型を定義
interface YoutubeVideoCardProps {
  video: YoutubeVideo;
  handleTitleClick: (id: number) => void; // タイトルクリック時のハンドラ
  handleLikeVideo: (id: number) => Promise<void>; // いいねクリック時のハンドラ
  handleUnlikeVideo: (id: number, likeId: number) => Promise<void>; // いいね解除クリック時のハンドラ
}

// YoutubeVideoCardコンポーネントを定義
const YoutubeVideoCard: React.FC<YoutubeVideoCardProps> = ({ video, handleTitleClick, handleLikeVideo, handleUnlikeVideo }) => {
  const { currentUser } = useAuth(); // 認証コンテキストから現在のユーザー情報を取得

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="video-container"> {/* 動画のアスペクト比を維持するためのラッパー */}
        <iframe
          className="video" // フレームを絶対配置
          src={`https://www.youtube.com/embed/${video.youtube_id}`} // YouTube動画のURLを設定
          frameBorder="0"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h2
          onClick={() => handleTitleClick(video.id)}
          className="text-xl font-bold text-blue-600 cursor-pointer hover:underline"
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
        {currentUser && ( // ユーザーがログインしている場合にのみいいね機能を表示
          <div className="flex items-center mt-2">
            {video.liked ? ( // 動画がいいねされている場合
              <Tooltip title="いいね解除">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  if (currentUser) { // ログインしている場合
                    const like = video.likes.find((like: Like) => like.user_id === Number(currentUser.id));
                    if (like) {
                      await handleUnlikeVideo(video.id, like.id); // いいね解除の処理
                    }
                  }
                }}>
                  <IconButton
                    color="secondary"
                  >
                    <FavoriteIcon style={{ color: 'red' }} /> {/* いいね済みアイコンを表示 */}
                  </IconButton>
                  <span style={{ color: 'black' }}>いいね解除</span> {/* いいね解除のラベル */}
                </div>
              </Tooltip>
            ) : ( // 動画がいいねされていない場合
              <Tooltip title="いいね">
                <div className="flex items-center cursor-pointer" onClick={async () => {
                  await handleLikeVideo(video.id); // いいねの処理
                }}>
                  <IconButton
                    color="primary"
                  >
                    <FavoriteBorderIcon /> {/* いいねアイコンを表示 */}
                  </IconButton>
                  <span style={{ color: 'black' }}>いいねする</span> {/* いいねのラベル */}
                </div>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoCard;
