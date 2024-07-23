import { useDrag, useDrop } from 'react-dnd';

const useDragDropVideoCard = (index: number, moveVideo: (dragIndex: number, hoverIndex: number) => void) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'VIDEO_CARD',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'VIDEO_CARD',
    hover: (draggedItem: { index: number }, monitor) => {
      if (!draggedItem || draggedItem.index === index) {
        return;
      }
      const hoverBoundingRect = monitor.getClientOffset();
      const hoverMiddleY = (hoverBoundingRect!.y - hoverBoundingRect!.y) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect!.y;

      if (draggedItem.index < index && hoverClientY < hoverMiddleY) {
        return;
      }
      if (draggedItem.index > index && hoverClientY > hoverMiddleY) {
        return;
      }

      moveVideo(draggedItem.index, index);
      draggedItem.index = index;
    },
  });

  const dragDropRef = (node: HTMLDivElement | null) => {
    dragRef(node);
    dropRef(node);
  };

  return { dragDropRef, isDragging };
};

export default useDragDropVideoCard;
