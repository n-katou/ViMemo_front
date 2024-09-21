import React, { RefObject } from 'react';
import Popover from '@mui/material/Popover';
import RelatedNotesList from '../../YoutubeIndex/RelatedNotesList';
import { Note } from '../../../types/note';

interface VideoPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  handlePopoverClose: () => void;
  relatedNotes: Note[];
  playerRef: RefObject<HTMLIFrameElement>;
}

const VideoPopover: React.FC<VideoPopoverProps> = ({
  open,
  anchorEl,
  handlePopoverClose,
  relatedNotes,
  playerRef,
}) => (
  <Popover
    id="mouse-over-popover"
    sx={{
      pointerEvents: 'none',
      '.MuiPopover-paper': {
        width: '600px',
        marginTop: '10px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    }}
    open={open}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    onClose={handlePopoverClose}
    disableRestoreFocus
  >
    <RelatedNotesList notes={relatedNotes.slice(0, 3)} playerRef={playerRef} />
  </Popover>
);

export default VideoPopover;
