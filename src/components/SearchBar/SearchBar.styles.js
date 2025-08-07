import { Search as SearchIconComponent } from '@mui/icons-material';
import { InputBase } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.backgroundColors.white,
  marginLeft: 0,
  width: '100%',
  height: '100%',
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const SearchIcon = styled(SearchIconComponent, {
  shouldForwardProp: (prop) => prop !== 'fontSize' && prop !== 'iconSize',
})(({ theme, iconSize }) => ({
  color: theme.palette.textColors.lightGrey,
  height: iconSize,
  width: iconSize,
}));

export const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'fontSize',
})(({ theme, fontSize }) => ({
  color: theme.palette.textColors.darkGrey,
  border: `1px solid ${theme.palette.borderColors.lightGrey}`,
  borderRadius: '0.4rem',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    fontSize,
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));
