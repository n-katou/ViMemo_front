// src/styles/editProfileStyles.ts
import { CSSProperties } from 'react';
import { SxProps } from '@mui/material';

export const formContainerStyles: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

export const labelStyles: CSSProperties = {
  color: 'black',
};

export const fileInputContainerStyles: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

export const fileInputStyles: CSSProperties = {
  color: 'black',
};

export const submitButtonStyles: SxProps = {
  background: 'linear-gradient(90deg, #e879f9, #38bdf8, #818cf8, #22eec5, #c084fc)',
  backgroundSize: '200% 200%',
  animation: 'gradientAnimation 10s ease infinite',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(90deg, #e879f9, #38bdf8, #818cf8, #22eec5, #c084fc)',
  },
};

export const snackbarStyles: SxProps = {
  marginTop: '84px',
  zIndex: 1400,
};
