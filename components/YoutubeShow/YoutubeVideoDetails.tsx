import React, { useState, useEffect } from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import YouTube from 'react-youtube';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface YoutubeVideoDetailsProps {
  video: YoutubeVideo & { formattedDuration: string };
  handleLike?: () => void; // いいねボタンがクリックされたときのハンドラ（オプショナル）
  handleUnlike?: () => void; // いいね解除ボタンがクリックされたときのハンドラ（オプショナル）
  currentUser: any;
  liked: boolean; // 動画がいいねされているかどうか
  onPlayerReady: (player: any) => void; // プレイヤーが準備完了したときのハンドラ
}

const YoutubeVideoDetails: React.FC<YoutubeVideoDetailsProps> = ({
  video, handleLike, handleUnlike, currentUser, liked, onPlayerReady
}) => {
  const [currentTime, setCurrentTime] = useState<string>('0:00'); // 動画の現在の再生時間
  const [player, setPlayer] = useState<any>(null); // YouTubeプレイヤーのインスタンス
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false); // 詳細情報の表示/非表示
  const [showTime, setShowTime] = useState<boolean>(true); // 現在の再生時間の表示/非表示

  // プレイヤーの状態が変わったときに呼ばれるハンドラ
  const handlePlayerStateChange = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const player = event.target;
      setPlayer(player);
      onPlayerReady(player);
    }
  };

  // プレイヤーのインスタンスが設定されたときに現在の再生時間を定期的に更新
  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        const time = player.getCurrentTime();
        setCurrentTime(formatTime(time));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [player]);

  // 秒数を分と秒の形式にフォーマットする関数（時間軸上の表示タイマー用）
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="relative video-wrapper">
        <YouTube
          videoId={video.youtube_id}
          opts={{ playerVars: { playsinline: 1 } }} // プレイヤーのオプションを設定
          onStateChange={handlePlayerStateChange} // プレイヤーの状態が変わったときにハンドラを呼び出す
          className="w-full aspect-video" // プレイヤーのスタイルを設定
        />
        {showTime && (
          <div className="absolute bottom-10 right-4 bg-black bg-opacity-50 text-white p-2 rounded">
            {currentTime} / {video.formattedDuration} {/* 現在の再生時間と動画の全長を表示 */}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold mr-4 text-gray-600">{video.title}</h2>
            <IconButton onClick={() => setIsCollapsed(!isCollapsed)}> {/* 詳細情報の表示/非表示を切り替えるボタン */}
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </div>
          <div className="flex items-center">
            <IconButton
              onClick={() => setShowTime(!showTime)} // 再生時間の表示/非表示を切り替える
              aria-label={showTime ? 'Hide Time' : 'Show Time'}
            >
              {showTime ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            <span className="ml-2 text-sm text-gray-700">
              {showTime ? '非表示' : '表示'} {/* 再生時間の表示状態に応じたラベル */}
            </span>
          </div>
        </div>
        {!isCollapsed && ( // 詳細情報が表示されている場合
          <>
            <p className="text-gray-600 mb-4">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
            <p className="text-gray-600 mb-4">動画時間: {video.formattedDuration}</p>
            {currentUser && ( // ログインしている場合にいいねボタンを表示
              <div className="flex items-center cursor-pointer" onClick={liked ? handleUnlike : handleLike}>
                <IconButton
                  color={liked ? 'secondary' : 'default'}
                  aria-label={liked ? 'Unlike' : 'Like'}
                  sx={{
                    borderRadius: '50%',
                    backgroundColor: liked ? '#ffebee' : 'transparent',
                    '&:hover': {
                      backgroundColor: liked ? '#ffcdd2' : '#f5f5f5',
                    },
                    transition: 'background-color 0.3s',
                  }}
                >
                  {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
                </IconButton>
                <span className="ml-2 text-lg font-medium text-gray-700">
                  {liked ? 'いいね済み' : 'いいねする'}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideoDetails;
