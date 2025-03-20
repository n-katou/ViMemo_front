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

  const handleShuffleClick = async () => {
    setIsShuffling(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const shuffledVideos = await shufflePlaylist(); // `shufflePlaylist()` の返り値を受け取る
    setYoutubeVideoLikes(shuffledVideos);

    setIsShuffling(false);
  };

  const handleConfirmOrder = async () => {
    if (!youtubeVideoLikes) return;

    setIsConfirming(true);
    await updatePlaylistOrder(jwtToken, youtubeVideoLikes, setYoutubeVideoLikes);
    setIsConfirming(false);
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
            disabled={isShuffling}
          >
            {isShuffling ? 'シャッフル中...' : 'プレイリストをシャッフル'}
          </Button>
          {isShuffling && <CustomSpinner size={150} bgColor="rgba(0, 0, 0, 0.7)" />}

          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            disabled={isConfirming}
            sx={{ marginLeft: '16px' }}
          >
            {isConfirming ? '保存中...' : '並び替え確定'}
          </Button>
        </Box>
      )}
    </Accordion>
  );
};

export default YoutubeLikesAccordion;
