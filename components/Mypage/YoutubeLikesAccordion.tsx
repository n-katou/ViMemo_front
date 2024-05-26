import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Like } from '../../types/like';

interface YoutubeLikesAccordionProps {
  youtubeVideoLikes: Like[];
  youtubePlaylistUrl: string;
  shufflePlaylist: () => void;
}

const YoutubeLikesAccordion: React.FC<YoutubeLikesAccordionProps> = ({ youtubeVideoLikes, youtubePlaylistUrl, shufflePlaylist }) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">「いいね」した動画プレイリスト</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {youtubeVideoLikes.length > 0 ? (
          <div className="mb-4 video-wrapper">
            <iframe
              src={youtubePlaylistUrl}
              frameBorder="0"
              allowFullScreen
              className="w-full aspect-video"
            ></iframe>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">いいねした動画がありません。</Typography>
        )}
      </AccordionDetails>
      {youtubeVideoLikes.length > 0 && (
        <Box textAlign="center" mt={2} mb={4}>
          <Button
            variant="contained"
            className="btn btn-outline btn-lightperple"
            startIcon={<ShuffleIcon />}
            onClick={shufflePlaylist}
          >
            プレイリストをシャッフル
          </Button>
        </Box>
      )}
    </Accordion>
  );
};

export default YoutubeLikesAccordion;
