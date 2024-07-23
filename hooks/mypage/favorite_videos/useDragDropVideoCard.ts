import { useDrag, useDrop } from 'react-dnd';
import { useRef, useState } from 'react';

const useDragDropVideoCard = (index: number, moveVideo: (dragIndex: number, hoverIndex: number) => void) => {
  // リファレンスを使用してDOM要素を参照
  const ref = useRef<HTMLDivElement | null>(null);

  // isOver状態を管理
  const [isOver, setIsOver] = useState(false);

  // useDragフックを使用してドラッグ機能を提供
  const [{ isDragging }, drag] = useDrag({
    type: 'VIDEO_CARD', // ドラッグアイテムのタイプを指定
    item: { index }, // ドラッグアイテムのデータ
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // ドラッグ中かどうかを監視
    }),
  });

  // useDropフックを使用してドロップ機能を提供
  const [{ isOverCurrent, canDrop }, drop] = useDrop({
    accept: 'VIDEO_CARD', // ドロップ可能なアイテムのタイプを指定
    hover: (draggedItem: { index: number }) => {
      setIsOver(true); // ドラッグ中に要素が重なっていることを示す
    },
    drop: (draggedItem: { index: number }) => {
      setIsOver(false); // ドラッグ終了時に要素が重なっていないことを示す
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveVideo(dragIndex, hoverIndex); // 要素の位置を変更
      }
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }), // 現在要素が重なっているかどうかを監視
      canDrop: monitor.canDrop(), // ドロップ可能かどうかを監視
    }),
  });

  // ドラッグとドロップのリファレンスを結合
  drag(drop(ref));

  return {
    dragDropRef: ref, // リファレンスを返す
    isDragging, // ドラッグ中かどうかの状態を返す
    isOver: canDrop && isOverCurrent, // 要素が重なっているかどうかの状態を返す
  };
};

export default useDragDropVideoCard;
