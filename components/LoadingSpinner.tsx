import React from 'react';
import { useTheme } from 'next-themes';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number; // サイズは画像の表示に合わせて調整できます
  bgColor?: string; // 背景色をカスタマイズできるようにする
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading, size = 100, bgColor = 'rgba(0, 0, 0, 0.75)' }) => {
  const { resolvedTheme } = useTheme(); // next-themesからテーマを取得
  const isDarkMode = resolvedTheme !== 'light'; // 初期状態をダークモードとし、ライトモードでない場合にライトモードのスピナーを表示

  const spinnerImage = isDarkMode ? '/black_spinner.gif' : '/white_spinner.gif';

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor, zIndex: 50 }}>
      <div className="text-center">
        <img src={spinnerImage} alt="Loading..." style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }} />
        <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
