import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSelector } from "react-redux";

const Nav = () => {
  let navigate = useNavigate();
  const user = useSelector((state) => state.auth.authToken);

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

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">TaskFlow</Typography>
        <Box sx={{ display: "flex", gap: "10px" }}>
          {user ? (
            <>
              <Button
                sx={{ fontSize: "20px" }}
                fullWidth
                color="success"
                variant="secondary"
                onClick={() => handleOptionClick("/tasks")}
              >
                Tasks
              </Button>
              <IconButton onClick={() => handleOptionClick("/settings")}>
                <SettingsIcon sx={{ fontSize: "40px" }} />
              </IconButton>
              <IconButton onClick={handleLogout}>
                <LogoutIcon sx={{ fontSize: "40px" }} />
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
