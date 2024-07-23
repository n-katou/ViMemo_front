import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Like } from '../../../types/like';
import { useTheme } from 'next-themes';
import CustomSpinner from './CustomSpinner'; // カスタムスピナーコンポーネントをインポート

interface YoutubeLikesAccordionProps {
  youtubeVideoLikes: Like[];
  youtubePlaylistUrl: string;
  shufflePlaylist: () => void;
}

const YoutubeLikesAccordion: React.FC<YoutubeLikesAccordionProps> = ({ youtubeVideoLikes, youtubePlaylistUrl, shufflePlaylist }) => {
  const { theme } = useTheme();
  const [isShuffling, setIsShuffling] = useState(false); // シャッフル中の状態を管理

  const handleShuffleClick = async () => {
    setIsShuffling(true); // シャッフル中の状態を開始
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 2秒間の遅延を追加
    await shufflePlaylist(); // シャッフル関数を呼び出し
    setIsShuffling(false); // シャッフル中の状態を終了
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
          「いいね」した動画プレイリスト
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {youtubeVideoLikes.length > 0 ? (
          <div className="mb-4 video-wrapper">
            <iframe
              src={youtubePlaylistUrl}
              allowFullScreen
              className="w-full aspect-video large-video"
            ></iframe>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
            いいねした動画がありません。
          </Typography>
        )}
      </AccordionDetails>
      {youtubeVideoLikes.length > 0 && (
        <Box textAlign="center" mt={2} mb={4}>
          <Button
            variant="contained"
            className="btn btn-outline btn-lightperple"
            startIcon={<ShuffleIcon />}
            onClick={handleShuffleClick}
            disabled={isShuffling} // シャッフル中はボタンを無効化
          >
            {isShuffling ? 'シャッフル中...' : 'プレイリストをシャッフル'}
          </Button>
          {isShuffling && <CustomSpinner size={150} bgColor="rgba(255, 255, 255, 0.5)" />}
        </Box>
      )}
    </Accordion>
  );
};

export default YoutubeLikesAccordion;
