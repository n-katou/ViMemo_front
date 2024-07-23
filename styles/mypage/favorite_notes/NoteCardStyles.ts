import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const NoteCardContainer = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export const NoteCardContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
}));

export const NoteCardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderTop: '1px solid #e0e0e0',
}));
