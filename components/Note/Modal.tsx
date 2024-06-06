import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

type ModalProps = {
  isOpen: boolean; // モーダルが開いているかどうかを示すフラグ
  onClose: () => void; // モーダルを閉じるためのコールバック関数
  children: React.ReactNode; // モーダル内に表示するコンテンツ
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  // モーダルが開いていない場合、何もレンダリングしない
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose} // 背景をクリックした場合にモーダルを閉じる
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // モーダルの内部をクリックしても背景クリックイベントが発動しないようにする
      >
        <IconButton
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose} // 閉じるボタンをクリックした場合にモーダルを閉じる
        >
          <CloseIcon />
        </IconButton>
        {children} {/* モーダル内のコンテンツを表示 */}
      </div>
    </div>
  );
};

export default Modal;
