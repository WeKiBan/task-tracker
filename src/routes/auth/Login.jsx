import { auth, googleProvider } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Here you can add your logic for handling login
    console.log('Username:', username);
    console.log('Password:', password);
    // Reset form fields
    setUsername('');
    setPassword('');
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
      navigate('/task-tracker/')
      console.log('signed-in')
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/task-tracker/')
      console.log('signed-in')
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto', marginTop: '100px' }} component='main' maxWidth='xs'>
      <Typography component='h1' variant='h5'>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField variant='outlined' margin='normal' required fullWidth id='username' label='Username' name='username' autoComplete='username' value={username} onChange={handleUsernameChange} />
        <TextField variant='outlined' margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' value={password} onChange={handlePasswordChange} />
        <Button onClick={handleSignIn} type='submit' fullWidth variant='contained' color='primary'>
          Sign In
        </Button>
        <Button onClick={handleSignInWithGoogle} sx={{ marginTop: '10px' }} fullWidth variant='contained' color='primary'>
          Sign in with Google <GoogleIcon sx={{ marginLeft: '5px' }} />
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
