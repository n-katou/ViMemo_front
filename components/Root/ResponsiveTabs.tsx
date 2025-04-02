import React from 'react';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { Tabs as MuiTabs } from './Tabs';

interface Props {
  tabs: { value: string; title: string; content: React.ReactNode }[];
  activeTab: string;
  handleTabChange: (event: SelectChangeEvent<string>) => void;
  isLightTheme: boolean;
  activeTabContent: React.ReactNode;
}

const ResponsiveTabs: React.FC<Props> = ({ tabs, activeTab, handleTabChange, isLightTheme, activeTabContent }) => {
  return (
    <>
      <Box sx={{ display: { xs: 'block', sm: 'none' }, marginTop: 5, color: isLightTheme ? 'black' : 'white' }}>
        <Select
          value={activeTab}
          onChange={handleTabChange}
          fullWidth
          sx={{
            color: 'white',
            backgroundColor: isLightTheme ? '#c084fc' : 'inherit',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
            '.MuiSvgIcon-root': { color: 'white' },
          }}
        >
          {tabs.map((tab) => (
            <MenuItem key={tab.value} value={tab.value} sx={{ color: 'black' }}>
              {tab.title}
            </MenuItem>
          ))}
        </Select>
        <Box sx={{ marginTop: 2 }}>{activeTabContent}</Box>
      </Box>
      <Box sx={{ display: { xs: 'none', sm: 'block' }, marginTop: 8, color: isLightTheme ? 'black' : 'white' }}>
        <MuiTabs tabs={tabs} />
      </Box>
    </>
  );
};

export default ResponsiveTabs;
