import { Select as SelectComponent } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Select = styled(SelectComponent)(({ theme, width }) => ({
  width: width || '100%',
  color: theme.palette.textColors.darkGrey,
  fontSize: '1.4rem',
}));
