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
import CustomSpinner from './CustomSpinner';

interface YoutubeLikesAccordionProps {
  youtubeVideoLikes: Like[] | undefined;
  youtubePlaylistUrl: string;
  shufflePlaylist: () => Promise<Like[]>; // 修正: 戻り値を Promise<Like[]> に変更
  setYoutubeVideoLikes: (likes: Like[]) => void;
  updatePlaylistOrder: (token: string, likes: Like[], setLikes: (likes: Like[]) => void) => Promise<void>;
  jwtToken: string;
}

const YoutubeLikesAccordion: React.FC<YoutubeLikesAccordionProps> = ({
  youtubeVideoLikes,
  youtubePlaylistUrl,
  shufflePlaylist,
  setYoutubeVideoLikes,
  updatePlaylistOrder,
  jwtToken
}) => {
  const { theme } = useTheme();
  const [isShuffling, setIsShuffling] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const handleShuffleClick = async () => {
    setIsShuffling(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const shuffledVideos = await shufflePlaylist();
    setYoutubeVideoLikes(shuffledVideos);

    setIsShuffling(false);
  };

  const handleConfirmOrder = async () => {
    if (!youtubeVideoLikes) return;

    setIsConfirming(true);
    await updatePlaylistOrder(jwtToken, youtubeVideoLikes, setYoutubeVideoLikes);

    // 画面をリロード
    setIsReloading(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000); // 2秒待ってリロード
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
          「いいね」した動画プレイリスト
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {Array.isArray(youtubeVideoLikes) && youtubeVideoLikes.length > 0 ? (
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
      {Array.isArray(youtubeVideoLikes) && youtubeVideoLikes.length > 0 && (
        <Box textAlign="center" mt={2} mb={4}>
          <Button
            variant="contained"
            className="btn btn-outline btn-lightperple"
            startIcon={<ShuffleIcon />}
            onClick={handleShuffleClick}
            disabled={isShuffling || isReloading}
            sx={{
              backgroundColor: isShuffling || isReloading ? '#ccc' : '#22eec5',
              color: isShuffling || isReloading ? 'gray' : 'white',
              cursor: isShuffling || isReloading ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: isShuffling || isReloading ? '#ccc' : '#1bb89a', // ホバー時の色
              },
            }}
          >
            {isShuffling ? 'シャッフル中...' : 'プレイリストをシャッフル'}
          </Button>

          {isShuffling && <CustomSpinner size={150} bgColor="rgba(0, 0, 0, 0.7)" />}

          <Button
            variant="contained"
            onClick={handleConfirmOrder}
            disabled={isConfirming || isReloading}
            sx={{
              marginLeft: '16px',
              backgroundColor: isConfirming || isReloading ? '#ccc' : '#38bdf8',
              color: isConfirming || isReloading ? 'gray' : 'white',
              cursor: isConfirming || isReloading ? 'not-allowed' : 'pointer',
              '&:hover': {
                backgroundColor: isConfirming || isReloading ? '#ccc' : '#1e90ff', // ホバー時の色
              },
            }}
          >
            {isReloading ? '並び替え...（保存中）' : isConfirming ? '保存中...' : '並び替え確定'}
          </Button>
        </Box>
      )}
    </Accordion>
  );
};

export default YoutubeLikesAccordion;
