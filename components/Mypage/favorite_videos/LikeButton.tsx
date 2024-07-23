import React from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeButtonProps {
  liked: boolean;
  onLikeClick: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ liked, onLikeClick }) => (
  <Tooltip title={liked ? "いいね解除" : "いいね"}>
    <div className="flex items-center cursor-pointer" onClick={onLikeClick}>
      <IconButton color={liked ? "secondary" : "primary"} className="like-button">
        {liked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteBorderIcon />}
      </IconButton>
      <span style={{ color: 'black' }}>{liked ? "いいね解除" : "いいねする"}</span>
    </div>
  </Tooltip>
);

export default LikeButton;
