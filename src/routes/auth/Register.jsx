import { auth, googleProvider, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
    // Reset form fields
    setUsername('');
    setPassword('');
  };

  const handleCreateUserCollection = async userCredential => {
    const { uid: userID, email } = userCredential.user;

    await setDoc(doc(db, 'users', userID), {
      userID: userID,
      email,
    });

    await setDoc(doc(db, `users/${userID}/tasks/`, 'tasks'), { activeTasks: [], inactiveTasks: [] });
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);

      await handleCreateUserCollection(userCredential);

      navigate('/task-tracker/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      await handleCreateUserCollection(userCredential);

      navigate('/task-tracker/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '300px', margin: '0 auto', marginTop: '100px' }} component='main' maxWidth='xs'>
      <Typography component='h1' variant='h5'>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField variant='outlined' margin='normal' required fullWidth id='username' label='Username' name='username' autoComplete='username' value={username} onChange={handleUsernameChange} />
        <TextField variant='outlined' margin='normal' required fullWidth name='password' label='Password' type='password' id='password' autoComplete='current-password' value={password} onChange={handlePasswordChange} />
        <Button onClick={handleRegister} type='submit' fullWidth variant='contained' color='primary'>
          Register
        </Button>
        <Button onClick={handleRegisterWithGoogle} sx={{ marginTop: '10px' }} fullWidth variant='contained' color='primary'>
          Register with Google <GoogleIcon sx={{ marginLeft: '5px' }} />
        </Button>
      </form>
    </Box>
  );
};

export default Register;
