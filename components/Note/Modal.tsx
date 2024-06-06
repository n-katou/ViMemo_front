import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useTheme } from 'next-themes';

type ModalProps = {
  isOpen: boolean; // モーダルが開いているかどうかを示すフラグ
  onClose: () => void; // モーダルを閉じるためのコールバック関数
  children: React.ReactNode; // モーダル内に表示するコンテンツ
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  // モーダルが開いていない場合、何もレンダリングしない
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // 背景をクリックした場合にモーダルを閉じる
    >
      <div
        className={`relative p-6 rounded-lg shadow-lg w-full max-w-md mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
        onClick={(e) => e.stopPropagation()} // モーダルの内部をクリックしても背景クリックイベントが発動しないようにする
      >
        {children} {/* モーダル内のコンテンツを表示 */}
      </div>
    </div>
  );
};

export default Modal;
