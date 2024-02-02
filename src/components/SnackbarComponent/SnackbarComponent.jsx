import { Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideSnackbar } from '../../redux/snackbarSlice';

const SnackbarComponent = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector(state => state.snackbar);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar open={snackbar.open} autoHideDuration={snackbar.duration} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Alert severity={snackbar.color}>{snackbar.message}</Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
