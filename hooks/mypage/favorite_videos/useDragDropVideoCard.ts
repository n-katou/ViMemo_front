import { useDrag, useDrop } from 'react-dnd';
import { useRef, useState } from 'react';

const useDragDropVideoCard = (index: number, moveVideo: (dragIndex: number, hoverIndex: number) => void) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOver, setIsOver] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'VIDEO_CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOverCurrent, canDrop }, drop] = useDrop({
    accept: 'VIDEO_CARD',
    hover: (draggedItem: { index: number }) => {
      setIsOver(true);
    },
    drop: (draggedItem: { index: number }) => {
      setIsOver(false);
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveVideo(dragIndex, hoverIndex);
      }
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  drag(drop(ref));

  return {
    dragDropRef: ref,
    isDragging,
    isOver: canDrop && isOverCurrent,
  };
};

export default useDragDropVideoCard;
