import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { applyActionCode, sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { setEmailVerified } from "../../redux/features/auth/authSlice";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { authToken, emailVerified } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authToken && emailVerified) {
      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
    const query = new URLSearchParams(location.search);
    const oobCode = query.get("oobCode");

    if (oobCode) {
      setIsEmailSent(false);

      applyActionCode(auth, oobCode)
        .then(() => {
          setIsVerified(true);
          dispatch(setEmailVerified());
        })
        .catch((error) => {
          console.error("Error verifying email: ", error);
          setErrorMessage("Invalid or expired verification link.");
        });
    } else {
      setIsEmailSent(true);
    }
  }, [location.search, authToken, emailVerified, dispatch, navigate]);

  const handleResendVerificationEmail = () => {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser) // Send email to the current user
        .then(() => setIsEmailSent(true))
        .catch((error) => {
          console.error("Failed to resend verification email:", error);
          setErrorMessage(
            "Failed to resend verification email... try again later.",
          );
        });
    } else {
      setErrorMessage("No user is logged in.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "500px",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          height: "290px",
          textAlign: "center",
        }}
      >
        {isLoading ? (
          <CircularProgress colour="primary" />
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Verify Your Email
            </Typography>
            <>
              {isEmailSent ? (
                <>
                  <Typography variant="body1" color="text.primary">
                    A verification email has been sent to your email address.
                    Please check your inbox and follow the instructions to
                    verify your email.
                  </Typography>
                  <Button
                    onClick={handleResendVerificationEmail}
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "20px" }}
                  >
                    Resend Verification Email
                  </Button>
                </>
              ) : isVerified ? (
                <Alert severity="success" sx={{ marginTop: "10px" }}>
                  Your email has been successfully verified. You can now log in
                  to your account, click <Link to="/tasks">here</Link> to
                  proceed.
                </Alert>
              ) : (
                <>
                  {errorMessage && (
                    <Alert severity="error" sx={{ marginTop: "10px" }}>
                      {errorMessage}
                    </Alert>
                  )}
                  <Button
                    onClick={handleResendVerificationEmail}
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: "20px" }}
                  >
                    Resend Verification Email
                  </Button>
                </>
              )}
            </>
          </>
        )}
      </Box>
    </Box>
  );
};

export default VerifyEmail;
