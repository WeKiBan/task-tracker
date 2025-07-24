import { useEffect, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_REQUEST, LOGIN_REQUEST_GOOGLE } from "../../redux/constants";
import { authError, clearAuthError } from "../../redux/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authToken, emailVerified, error } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (authToken !== null) {
      if (emailVerified) {
        navigate("/active-tasks");
      } else {
        navigate("/verify-email");
      }
    } else {
      setTimeout(() => setIsLoading(false), 700);
    }
  }, [authToken, emailVerified, navigate, error]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, location.pathname]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      dispatch(authError("Email and password are required."));
      return;
    }
    dispatch({ type: LOGIN_REQUEST, payload: { email, password, navigate } });
    dispatch(authError(""));
    setIsLoading(true);
  };

  const handleSignInWithGoogle = () => {
    dispatch({ type: LOGIN_REQUEST_GOOGLE, payload: { navigate } });
    setEmail("");
    setPassword("");
    dispatch(authError(""));
    setIsLoading(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignIn();
    setEmail("");
    setPassword("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100v%",
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
          minHeight: "290px",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <form
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
            onSubmit={handleSubmit}
          >
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
            <Link style={{ margin: "0 auto" }} to="/reset-password">
              <Button variant="text" color="primary">
                Forgot Password?
              </Button>
            </Link>
            {error && error && (
              <Alert severity="error" sx={{ marginTop: "10px" }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: "20px" }}
            >
              Sign In
            </Button>
            <Button
              onClick={handleSignInWithGoogle}
              sx={{ marginTop: "10px" }}
              fullWidth
              variant="contained"
              color="primary"
            >
              Sign in with Google <GoogleIcon sx={{ marginLeft: "5px" }} />
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
              <Typography variant="body1">Don’t have an account?</Typography>
              <Link to="/register">
                <Button variant="text" color="primary">
                  Create one here
                </Button>
              </Link>
            </Box>
          </form>
        )}
      </Box>
    </Box>
  );
};

export default Login;
