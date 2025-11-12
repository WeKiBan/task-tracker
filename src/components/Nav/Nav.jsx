import { AppBar, Button, IconButton } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth } from '../../config/firebase';
import {
  IconButtonContainer,
  LogoText,
  LogoutIcon,
  MailIcon,
  SettingsIcon,
  TextButton,
  TextButtonContainer,
  Toolbar,
} from './Nav.styles';

function Nav({ isStorybook = false }) {
  const navigate = useNavigate();
  const { uid } = useSelector((s) => s.auth);
  const { pathname } = useLocation();

  const handleOptionClick = (page) => {
    navigate(page);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('signed out');
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log('An error has occured: ', errorCode, errorMessage);
    }
  };

  const handleMail = () => {
    console.log('wes:', 'mail');
  };

  return (
    <AppBar position="static" elevation={0} sx={{ minHeight: 48, height: 48 }}>
      <Toolbar sx={{ minHeight: 48, '@media (min-width:600px)': { minHeight: 48 } }}>
        <TextButtonContainer>
          <LogoText>TaskFlo</LogoText>

          {(!!uid || isStorybook) && (
            <>
              <TextButton
                variant="secondary"
                onClick={() => handleOptionClick('/active-tasks')}
                isActive={isStorybook || pathname === '/active-tasks'}
              >
                Active Tasks
              </TextButton>
              <TextButton
                variant="secondary"
                onClick={() => handleOptionClick('/inactive-tasks')}
                isActive={pathname === '/inactive-tasks'}
              >
                Inactive Tasks
              </TextButton>
            </>
          )}
        </TextButtonContainer>

        <IconButtonContainer>
          {!!uid || isStorybook ? (
            <>
              <IconButton color="primary" onClick={() => handleOptionClick('/settings')}>
                <SettingsIcon />
              </IconButton>
              <IconButton color="primary" onClick={handleMail}>
                <MailIcon />
              </IconButton>
              <IconButton color="primary" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                color="success"
                variant="secondary"
                onClick={() => handleOptionClick('/login')}
              >
                Sign In
              </Button>
              <Button
                color="success"
                variant="secondary"
                onClick={() => handleOptionClick('/register')}
              >
                Register
              </Button>
            </>
          )}
        </IconButtonContainer>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
