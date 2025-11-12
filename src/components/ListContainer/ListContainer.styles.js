import { Add } from '@mui/icons-material';
import { Box, IconButton as IconButtonComponent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: '100%',
  flexGrow: 1,
}));

export const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  padding: '0.8rem',
  backgroundColor: theme.palette.backgroundColors.darkGrey,
  flexGrow: 1,
  overflowY: 'auto',
}));

export const LabelWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  borderBottom: `1px solid ${theme.palette.borderColors.lightGrey}`,
}));

export const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.darkGrey,
  fontSize: '1.4rem',
  lineHeight: '3.2rem',
  paddingLeft: '0.8rem',
  fontWeight: 500,
}));

export const IconButton = styled(IconButtonComponent)(() => ({
  padding: '4px',
}));

export const AddIcon = styled(Add)(() => ({
  width: '2.4rem',
  height: '2.4rem',
}));
