import { Logout, Mail, Settings } from '@mui/icons-material';
import { Box, Toolbar as ToolbarComponent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Toolbar = styled(ToolbarComponent)(({ theme }) => ({
  justifyContent: 'space-between',
  background: theme.palette.backgroundColors.white,
  color: theme.palette.textColors.darkGrey,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.borderColors.lightGrey}`,
}));

export const TextButtonContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1.6rem',
}));

export const TextButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})(({ theme, isActive }) => ({
  display: 'flex',
  width: '100%',
  whiteSpace: 'nowrap',
  fontSize: '1.6rem',
  textTransform: 'capitalize',
  padding: '0',
  borderBottom: `${isActive ? '1px' : '0'} solid ${theme.palette.textColors.darkGrey}`,
  borderRadius: 0,
  cursor: 'pointer',
}));

export const LogoText = styled(Typography)(() => ({
  fontSize: '2rem',
}));

export const IconButtonContainer = styled(Box)(() => ({
  display: 'flex',
  gap: '10px',
}));

export const SettingsIcon = styled(Settings)(() => ({
  fontSize: '2.4rem',
}));

export const LogoutIcon = styled(Logout)(() => ({
  fontSize: '2rem',
}));
export const MailIcon = styled(Mail)(() => ({
  fontSize: '2rem',
}));
