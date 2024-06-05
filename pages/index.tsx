import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, Typography, Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/Root/Tabs'; // Tabsコンポーネントをインポート
import { WavyBackground } from '../components/Root/WavyBackground'; // WavyBackgroundコンポーネントをインポート
import tabs from '../components/Root/tab'; // tabsをインポート
import { styled } from '@mui/system';
import GradientButton from '../styles/GradientButton';


const RootPage = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const { currentUser } = useAuth();

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

  return (
    <WavyBackground colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]} waveOpacity={0.3}>
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
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px', paddingTop: '100px' }}>
          <div style={{ padding: 0, textAlign: 'left', width: '100%', maxWidth: '1500px', backgroundColor: 'transparent', color: 'white', boxShadow: 'none' }}>
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                margin: 0,
              }}
            >
              ViMemoは、動画視聴中に直感的にメモを追加できるサービスです
            </Typography>
            <Typography variant="h5" sx={{ marginTop: 10 }}>機能説明</Typography>
            <Box sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 5 }}>
              <Select value={activeTab} onChange={handleTabChange} fullWidth sx={{ color: 'white' }}>
                {tabs.map((tab) => (
                  <MenuItem key={tab.value} value={tab.value} sx={{ color: 'black' }}>
                    {tab.title}
                  </MenuItem>
                ))}
              </Select>
              <Box sx={{ marginTop: 2 }}>
                {activeTabContent}
              </Box>
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, marginTop: 8 }}>
              <Tabs tabs={tabs} />
            </Box>
            {!currentUser && (
              <Box display="flex" justifyContent="center">
                <GradientButton
                  onClick={() => router.push('/login')}
                  variant="contained"
                  sx={{
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                >
                  ログインページへ
                </GradientButton>
              </Box>
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
  );
};

export default RootPage;
