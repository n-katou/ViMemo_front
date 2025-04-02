import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { Snackbar, Alert, Typography, Box, SelectChangeEvent } from '@mui/material';

import { useAuth } from '../context/AuthContext';

import LoginButton from '../components/LoginButton';
import { WavyBackground } from '../components/Root/WavyBackground';
import HeroImage from '../components/Root/HeroImage';
import tab from '../components/Root/tab';
import FeatureNotice from '../components/Root/FeatureNotice';
import ResponsiveTabs from '../components/Root/ResponsiveTabs';

const RootPage = () => {
  const { currentUser } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  const [tabs, setTabs] = useState(tab(isLightTheme));
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [mounted, setMounted] = useState(false);

  const bgClass = theme === 'dark' ? 'bg-black text-white' : 'bg-white text-[#818cf8]';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setTabs(tab(isLightTheme));
    }
  }, [isLightTheme, mounted]);

  useEffect(() => {
    const logoutMessage = localStorage.getItem('logoutMessage');
    if (logoutMessage) {
      setSnackbarMessage(logoutMessage);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      localStorage.removeItem('logoutMessage');
    }
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleTabChange = (event: SelectChangeEvent<string>) => {
    setActiveTab(event.target.value);
  };

  const activeTabContent = tabs.find(tab => tab.value === activeTab)?.content;

  if (!mounted) return null;

  return (
    <div style={{ position: 'relative', zIndex: 0 }} className={bgClass}>
      <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '20px 0' }}>
        <Typography
          variant="h1"
          gutterBottom
          className="rainbow-border"
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            margin: 0,
            marginTop: 10,
            paddingBottom: '10px',
            display: 'inline-block'
          }}
        >
          ViMemo（ビメモ）は、動画視聴中に直感的にメモを追加できるサービスです
        </Typography>
      </Box>
      <HeroImage />
      <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3} style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0,
          }}
        >
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px', paddingTop: '50px', marginBottom: '20px' }}>
            <div style={{ padding: 0, textAlign: 'left', width: '100%', maxWidth: '1500px', backgroundColor: 'transparent', color: isLightTheme ? 'black' : 'white', boxShadow: 'none' }}>
              <FeatureNotice isLightTheme={isLightTheme} />
              <ResponsiveTabs
                tabs={tabs}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
                isLightTheme={isLightTheme}
                activeTabContent={activeTabContent}
              />
              {!currentUser && (
                <LoginButton />
              )}
            </div>
          </div>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </WavyBackground>
    </div>
  );
};

export default RootPage;
