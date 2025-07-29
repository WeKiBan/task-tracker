import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from '../../config/firebase';
import { setEmailVerified } from '../../redux/features/auth/authSlice';

function Action() {
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentMode, setCurrentMode] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionCode, setActionCode] = useState(null);
  const location = useLocation();
  const hasHandledActionRef = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setAlertType('error');
      setAlertMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    confirmPasswordReset(auth, actionCode, password)
      .then(() => {
        setIsSubmitting(false);
        setAlertType('success');
        setAlertMessage('Password has been reset successfully.');
        setTimeout(() => navigate('/login'), 1000);
      })
      .catch((error) => {
        setIsSubmitting(false);
        setAlertType('error');
        console.error('Error confirming password reset:', error.code);
        setAlertMessage('Error resetting password.');
      });
  };

  useEffect(() => {
    if (hasHandledActionRef.current) return;

    const query = new URLSearchParams(location.search);
    const code = query.get('oobCode');
    const mode = query.get('mode');

    setActionCode(code);
    setCurrentMode(mode);

    if (code && mode) {
      switch (mode) {
        case 'resetPassword':
          verifyPasswordResetCode(auth, code)
            .then((userEmail) => {
              setEmail(userEmail);
              setIsLoading(false);
            })
            .catch((error) => {
              setIsLoading(false);
              setAlertType('error');
              console.error('Error verifying reset code:', error.code);
              setAlertMessage('Invalid or expired reset code.');
            });
          break;
        case 'verifyEmail':
          applyActionCode(auth, actionCode)
            .then(() => {
              dispatch(setEmailVerified());
              setIsLoading(false);
              setAlertType('success');
              setAlertMessage('Email verification successful. You can now log in.');
              setTimeout(() => navigate('/active-tasks'), 1000);
            })
            .catch((error) => {
              setIsLoading(false);
              setAlertType('error');
              console.error('Error verifying email:', error.code);
              setAlertMessage('Invalid or expired verification link.');
            });
          break;
        default:
          setIsLoading(false);
          setAlertMessage('Invalid action mode.');
          setAlertType('error');
      }
      hasHandledActionRef.current = true;
    } else {
      setIsLoading(false);
      setAlertMessage('Invalid or missing action code.');
      setAlertType('error');
    }
  }, [location.search, actionCode, dispatch, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          width: '500px',
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          minHeight: '133px',
        }}
      >
        {isLoading ? (
          <CircularProgress sx={{ marginTop: '10px' }} color="primary" />
        ) : (
          <>
            <Typography variant="h5" component="h1" gutterBottom>
              {currentMode === 'verifyEmail' && 'Verify Email'}
              {currentMode === 'resetPassword' && 'Reset Password'}
              {currentMode === 'recoverEmail' && 'Recover Email'}
              {currentMode === null && 'There has been a mistake.'}
            </Typography>
            {currentMode === 'resetPassword' &&
              alertMessage !== 'Invalid or expired reset code.' && (
                <form onSubmit={handleResetPassword}>
                  {email && (
                    <Alert severity="info" sx={{ marginTop: '10px' }}>
                      Enter a new password for your account associated with {email}
                    </Alert>
                  )}
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Enter new password..."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Confirm new password..."
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: '20px' }}
                    disabled={isSubmitting}
                    size="large"
                  >
                    {isSubmitting ? 'Sending...' : 'Reset Password'}
                  </Button>
                </form>
              )}
            {alertMessage && (
              <Alert severity={alertType} sx={{ marginTop: '10px' }}>
                {alertMessage}
              </Alert>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Action;
