import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function BasicTabs({ value, handleChangeTab, tabs}) {

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChangeTab}>
            {tabs.map((tab) => <Tab key={tab.value} label={tab.label} value={tab.value} />)}
        </Tabs>
      </Box>
    </Box>
  );
}