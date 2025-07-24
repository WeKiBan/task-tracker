import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Box, Typography, Button, Alert } from "@mui/material";

const VerifyEmail = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleResendVerificationEmail = () => {
    if (auth.currentUser) {
      sendEmailVerification(auth.currentUser) // Send email to the current user
        .then(() => {
          setIsEmailSent(true);
          setAlertMessage("Successfully resent verification email");
        })
        .catch((error) => {
          console.error("Failed to resend verification email:", error);
          setAlertMessage(
            "Failed to resend verification email... try again later.",
          );
        });
    } else {
      setAlertMessage("No user is logged in.");
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
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          width: "500px",
          background: "white",
          padding: "20px",
          minHeight: "279px",
          borderRadius: "8px",
          textAlign: "center",
          gap: "20px",
          paddingTop: "40px",
        }}
      >
        <Typography variant="h4">Verify Your Email</Typography>
        <Typography variant="body1" color="text.primary">
          A verification email has been sent to your email address. Please check
          your inbox and follow the instructions to verify your email.
        </Typography>
        <Button
          onClick={handleResendVerificationEmail}
          variant="contained"
          color="primary"
        >
          Resend Verification Email
        </Button>

        {alertMessage && (
          <Alert severity={isEmailSent ? "success" : "error"}>
            {alertMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default VerifyEmail;
