import { Button } from '@mui/material';
import { styled } from '@mui/system';

const GradientButton = styled(Button)({
  background: 'linear-gradient(to right, #38bdf8, #818cf8, #c084fc, #e879f9, #22eec5)', // 背景のグラデーション
  backgroundSize: '200% 200%',
  animation: 'rainbow 7s ease infinite', // グラデーションアニメーションを追加
  color: 'white',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)', // ホバー時に拡大
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)', // ホバー時にシャドウを追加
  },
  '&:active': {
    transform: 'scale(0.95)', // クリック時に縮小
  },
});

export default GradientButton;
