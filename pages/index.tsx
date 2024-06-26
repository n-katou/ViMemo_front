import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Typography, Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/Root/Tabs';
import { WavyBackground } from '../components/Root/WavyBackground';
import { useTheme } from 'next-themes';
import GradientButton from '../styles/GradientButton';
import tab from '../components/Root/tab';
import Image from 'next/image';
import pinterestBoardPhoto from '../public/pinterest_board_photo.png'; // 画像のパスを指定
import InfoIcon from '@mui/icons-material/Info';

const RootPage = () => {
  const router = useRouter();
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
      <Box
        display="flex"
        justifyContent="center"
        mb={4}
        sx={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          marginTop: '20px',
          zIndex: 1,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <Box
          className="gradient-overlay relative w-full h-auto overflow-hidden"
          sx={{
            width: '100%',
            height: 'auto',
          }}
        >
          <Image
            src={pinterestBoardPhoto}
            alt="Pinterest Board"
            layout="responsive"
            width={1500}
            height={500}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>
      </Box>
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
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '0 20px', paddingTop: '50px' }}>
            <div style={{ padding: 0, textAlign: 'left', width: '100%', maxWidth: '1500px', backgroundColor: 'transparent', color: isLightTheme ? 'black' : 'white', boxShadow: 'none' }}>
              <Box sx={{
                backgroundColor: isLightTheme ? '#e3f2fd' : '#c084fc',
                padding: '15px 25px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                maxWidth: '500px', // ここで幅を制限
                margin: '0 auto', // 中央揃え
              }}>
                <InfoIcon sx={{ fontSize: '2rem', color: isLightTheme ? '#38bdf8' : 'white' }} />
                <Box>
                  <Typography variant="h5" sx={{ color: isLightTheme ? '#38bdf8' : 'white', fontWeight: 'bold' }}>
                    機能説明
                  </Typography>
                  <Typography variant="body1" sx={{ color: isLightTheme ? '#38bdf8' : 'white' }}>
                    下のタブをクリックしたら各機能の詳細を確認できます
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 5, color: isLightTheme ? 'black' : 'white' }}>
                <Select
                  value={activeTab}
                  onChange={handleTabChange}
                  fullWidth
                  sx={{
                    color: 'white',
                    backgroundColor: isLightTheme ? '#c084fc' : 'inherit',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'gray',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'gray',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'gray',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
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
              <Box sx={{ display: { xs: 'none', sm: 'block' }, marginTop: 8, color: isLightTheme ? 'black' : 'white' }}>
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
                      backgroundColor: '#38bdf8',
                      color: 'white',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        backgroundColor: '#1e88e5',
                      }
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
    </div>
  );
};

export default RootPage;
