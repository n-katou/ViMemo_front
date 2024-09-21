import React from 'react';
import { Box, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import useEditProfile from '../../hooks/mypage/edit/useEditProfile';
import { formContainerStyles, labelStyles, fileInputContainerStyles, fileInputStyles, submitButtonStyles, snackbarStyles } from '../../styles/mypage/edit/editProfileStyles';
import { WavyBackground } from '../../components/Root/WavyBackground';

const EditProfile = () => {
  const {
    user,
    name,
    avatar,
    loading,
    error,
    validationErrors,
    setName,
    handleFileChange,
    handleSubmit,
    handleCloseSnackbar,
  } = useEditProfile();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <WavyBackground
        colors={["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22ee8f"]}
        waveOpacity={0.3}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box className="w-full lg:w-2/3 xl:w-1/2 bg-white shadow-md rounded-lg p-8">
            <Typography variant="h5" component="h2" style={{ color: 'black', textAlign: 'center', marginBottom: '20px' }}>
              プロフィール編集
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box sx={formContainerStyles}>
                <Box sx={fileInputContainerStyles}>
                  <label className="label text-gray-700" style={labelStyles}>アバター</label>
                  <Box sx={fileInputContainerStyles}>
                    {user?.avatar_url && (
                      <img
                        src={user.avatar_url}
                        className="rounded-full border border-gray-300"
                        id="preview"
                        alt="Avatar"
                        width="80"
                        height="80"
                      />
                    )}
                    <input
                      type="file"
                      className="input-file p-2 border border-gray-300 rounded-lg"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={fileInputStyles}
                    />
                  </Box>
                </Box>
                <TextField
                  label="名前"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!validationErrors.find(error => error.includes('名前'))}
                  helperText={validationErrors.find(error => error.includes('名前'))}
                  InputProps={{
                    style: { color: 'black' },
                  }}
                  InputLabelProps={{
                    style: { color: 'black' }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={submitButtonStyles}
                >
                  {loading ? '更新中...' : '更新'}
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
        <Snackbar
          open={!!error || validationErrors.length > 0}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={snackbarStyles}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
            <ul>
              {validationErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </Alert>
        </Snackbar>
      </WavyBackground>
    </div>
  );
};

export default EditProfile;
