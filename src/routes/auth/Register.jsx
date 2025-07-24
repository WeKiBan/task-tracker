import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch } from "react-redux";
import { REGISTER_REQUEST, LOGIN_REQUEST_GOOGLE } from "../../redux/constants";
import { useSelector } from "react-redux";
import { authError, clearAuthError } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      setTimeout(() => setIsLoading(false), 700);
    }
  }, [error]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, location.pathname]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = () => {
    if (password !== confirmPassword) {
      dispatch(authError("Passwords do not match"));
      return;
    }

    dispatch({
      type: REGISTER_REQUEST,
      payload: { email, password, navigate },
    });
    dispatch(authError(""));
    setIsLoading(true);
  };

  const handleRegisterWithGoogle = () => {
    dispatch({ type: LOGIN_REQUEST_GOOGLE, navigate });
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    dispatch(authError(""));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundImage:
          'url("https://images.unsplash.com/photo-1637611331620-51149c7ceb94?q=80&w=2940")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      component="main"
      maxWidth="xs"
    >
      <Box
        sx={{
          width: "500px",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "300px",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            {error && (
              <Alert severity="error" sx={{ marginTop: "10px" }}>
                {error}
              </Alert>
            )}
            <Button
              onClick={handleRegister}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
            >
              Register
            </Button>
            <Button
              onClick={handleRegisterWithGoogle}
              sx={{ marginTop: "10px" }}
              fullWidth
              variant="contained"
              color="primary"
            >
              Register with Google <GoogleIcon sx={{ marginLeft: "5px" }} />
            </Button>
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="body1">Already have an account?</Typography>
              <Link to="/login">
                <Button variant="text" color="primary">
                  login here
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Register;
