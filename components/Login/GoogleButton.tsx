import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledGoogleButton = styled(Button)({
  backgroundColor: '#4285F4',
  color: 'white',
  textTransform: 'none',
  fontSize: '16px',
  padding: '10px 24px',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#357ae8',
    transform: 'scale(1.05)',
    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
});

interface Props {
  onClick: () => void;
  loading: boolean;
}

const GoogleButton: React.FC<Props> = ({ onClick, loading }) => (
  <StyledGoogleButton
    variant="contained"
    onClick={onClick}
    disabled={loading}
    startIcon={
      !loading && (
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google logo"
          style={{ width: 20, height: 20 }}
        />
      )
    }
  >
    {loading ? <CircularProgress size={24} style={{ color: '#fff' }} /> : 'Googleでログイン'}
  </StyledGoogleButton>
);

export default GoogleButton;
