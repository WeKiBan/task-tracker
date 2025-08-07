import { Add, Search as SearchIconComponent } from '@mui/icons-material';
import { Box, Button as ButtonComponent } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Wrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxHeight: '100%',
  height: '100%',
  flexGrow: 1,
  minWidth: 0,
}));

export const SearchWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  gap: '0.8rem',
}));

export const Button = styled(ButtonComponent)(({ theme }) => ({
  width: '4.5rem',
  height: '4.5rem',
  padding: 0,
  minWidth: '4.5rem',
  backgroundColor: theme.palette.buttonColors.blue,
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
}));
export const AddIcon = styled(Add)(() => ({
  height: '2.4rem',
  width: '2.4rem',
}));

export const ItemContainer = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
  width: '100%',
  marginTop: '0.8rem',
  flexGrow: 1,
  overflowY: 'auto',
  height: '100%',
  maxHeight: '100%',
}));

export const NoMatchingSearchResults = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '1rem',
  width: '100%',
  marginTop: '0.8rem',
  fontSize: '16px',
  padding: 20,
}));

export const SearchIcon = styled(SearchIconComponent, {
  shouldForwardProp: (prop) => prop !== 'fontSize' && prop !== 'iconSize',
})(({ theme, iconSize }) => ({
  color: theme.palette.textColors.lightGrey,
  height: iconSize,
  width: iconSize,
}));

export const EmptySearchText = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'grey',
  '& span:first-of-type': {
    fontWeight: 'bold',
    fontSize: '24px',
  },
}));
