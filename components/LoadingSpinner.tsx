import React from 'react';
import { useTheme } from 'next-themes';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number; // サイズは画像の表示に合わせて調整できます
  bgColor?: string; // 背景色をカスタマイズできるようにする（オプション、優先度は低い）
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading, size = 100, bgColor }) => {
  const { resolvedTheme } = useTheme(); // next-themesからテーマを取得
  const isDarkMode = resolvedTheme === 'dark';

  // 背景色をテーマに応じて設定、bgColorが指定されていればそれを優先
  const backgroundColor = bgColor || (isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)');

  const spinnerImage = isDarkMode ? '/black_spinner.gif' : '/white_spinner.gif';

  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor, zIndex: 50 }}>
      <div className="text-center">
        <img src={spinnerImage} alt="Loading..." style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }} />
        <p className={isDarkMode ? 'text-white' : 'text-black'} style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
