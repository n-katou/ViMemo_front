import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

const useDragDropVideoCard = (index: number, moveVideo: (dragIndex: number, hoverIndex: number) => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // useDragフックの設定
  const [{ isDragging }, drag] = useDrag({
    type: 'VIDEO_CARD', // ドラッグするアイテムのタイプを指定
    item: { index }, // ドラッグするアイテムとして現在のインデックスを指定
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // ドラッグ中かどうかの状態を収集
    }),
  });

  // useDropフックの設定
  const [, drop] = useDrop({
    accept: 'VIDEO_CARD', // 受け入れるアイテムのタイプを指定
    hover: (draggedItem: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect(); // ホバー中の要素の境界矩形を取得
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // 要素の中央のY座標を計算
      const clientOffset = monitor.getClientOffset(); // マウスの現在の位置を取得
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top; // ホバー中の要素内のマウスのY座標を計算

      // ホバー中の要素の中央を越えたかどうかをチェック
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveVideo(dragIndex, hoverIndex); // 動画カードを移動
      draggedItem.index = hoverIndex; // ドラッグ中のアイテムのインデックスを更新
    },
    drop: (draggedItem: { index: number }) => {
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveVideo(dragIndex, hoverIndex); // ドロップ時に最終的な位置を確定
      }
    },
  });

  drag(drop(ref)); // ドラッグとドロップの参照を結合

  return {
    dragDropRef: ref, // ドラッグ＆ドロップの参照
    isDragging, // ドラッグ中の状態
  };
};

export default useDragDropVideoCard;
