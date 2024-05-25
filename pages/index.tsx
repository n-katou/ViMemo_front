"use client";

import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Alert, Typography, Box, Paper, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/Tabs'; // Tabsコンポーネントをインポート

const tabs = [
  {
    title: "アカウント管理",
    value: "account_management",
    content: (
      <div className="p-4 text-xl md:text-2xl">
        <p>Googleアカウントを利用すれば、登録不要でログインが可能です。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/login.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "メモ操作",
    value: "video_and_notes",
    content: (
      <div className="p-4 text-xl md:text-2xl">
        <p>動画再生中にメモを追加し、重要なポイントを記録。後で簡単にアクセスできます。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/sousa.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "検索機能",
    value: "video_search",
    content: (
      <div className="p-4 text-xl md:text-2xl">
        <p>キーワードで動画を検索し、サジェスト機能を利用できます。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/search.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "動画取得",
    value: "video_get",
    content: (
      <div className="p-4 text-xl md:text-2xl">
        <p>マイページから動画を取得できます。取得権限が必要な場合はお問い合わせください。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/get.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "プレイリスト",
    value: "video_playlist",
    content: (
      <div className="p-4 text-xl md:text-2xl">
        <p>いいねした動画でプレイリストを作成し、シャッフル再生が可能です。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/playlist.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
];

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem' }}
    >
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'left', width: '100%', maxWidth: 'auto', height: 'auto', overflow: 'hidden' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}
        >
          ViMemoは、動画視聴中に直感的にメモを追加できるサービスです
        </Typography>
        <Typography variant="h5" sx={{ marginTop: 4 }}>機能説明</Typography>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <Select value={activeTab} onChange={handleTabChange} fullWidth>
            {tabs.map((tab) => (
              <MenuItem key={tab.value} value={tab.value}>
                {tab.title}
              </MenuItem>
            ))}
          </Select>
          <Box sx={{ marginTop: 2 }}>
            {activeTabContent}
          </Box>
        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'block' }, marginTop: 2 }}>
          <Tabs tabs={tabs} />
        </Box>
        {!currentUser && (
          <Button onClick={() => router.push('/login')} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            ログインページへ
          </Button>
        )}
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RootPage;
