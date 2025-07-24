import { AppBar, IconButton, Button } from "@mui/material";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Toolbar,
  LogoText,
  LogoutIcon,
  SettingsIcon,
  MailIcon,
  IconButtonContainer,
  TextButtonContainer,
  TextButton,
} from "./Nav.styles";

const Nav = ({ isStorybook = false }) => {
  let navigate = useNavigate();
  const user = useSelector((state) => state.auth.authToken);
  const { pathname } = useLocation();

  const handleOptionClick = (page) => {
    navigate(page);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("An error has occured: ", errorCode, errorMessage);
    }
  };

  const handleMail = () => {
    console.log("wes:", "mail");
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <TextButtonContainer>
          <LogoText>TaskFlow</LogoText>
          {!!user ||
            (isStorybook && (
              <>
                <TextButton
                  fullWidth
                  variant="secondary"
                  onClick={() => handleOptionClick("/active-tasks")}
                  isActive={isStorybook || pathname === "/active-tasks"}
                >
                  Active Tasks
                </TextButton>
                <TextButton
                  fullWidth
                  variant="secondary"
                  onClick={() => handleOptionClick("/inactive-tasks")}
                  isActive={pathname === "/inactive-tasks"}
                >
                  Inactive Tasks
                </TextButton>
              </>
            ))}
        </TextButtonContainer>
        <IconButtonContainer>
          {!!user || isStorybook ? (
            <>
              <IconButton onClick={() => handleOptionClick("/settings")}>
                <SettingsIcon />
              </IconButton>
              <IconButton onClick={handleMail}>
                <MailIcon />
              </IconButton>
              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                fullWidth
                color="success"
                variant="secondary"
                onClick={() => handleOptionClick("/login")}
              >
                Sign In
              </Button>
              <Button
                fullWidth
                color="success"
                variant="secondary"
                onClick={() => handleOptionClick("/register")}
              >
                Register
              </Button>
            </>
          )}
        </IconButtonContainer>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
