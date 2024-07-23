import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

const useDragDropVideoCard = (index: number, moveVideo: (dragIndex: number, hoverIndex: number) => void) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'VIDEO_CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'VIDEO_CARD',
    hover: (draggedItem: { index: number }, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveVideo(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
    drop: (draggedItem: { index: number }) => {
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex !== hoverIndex) {
        moveVideo(dragIndex, hoverIndex);
      }
    },
  });

  drag(drop(ref));

  return {
    dragDropRef: ref,
    isDragging,
  };
};

export default useDragDropVideoCard;
