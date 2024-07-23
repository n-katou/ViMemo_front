import { useState, MouseEvent } from 'react';

const useNotePopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return {
    anchorEl,
    open,
    handlePopoverOpen,
    handlePopoverClose,
  };
};

export default useNotePopover;
