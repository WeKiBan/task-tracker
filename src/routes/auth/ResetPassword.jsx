import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent! Check your inbox and follow the instructions.",
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
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
          width: "500px",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minHeight: "200px",
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleResetPassword}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px" }}
            disabled={isSubmitting}
            size="large"
          >
            {isSubmitting ? "Sending..." : "Reset Password"}
          </Button>
        </form>
        {message && (
          <Alert sx={{ marginTop: "20px" }} severity="success">
            {message}
          </Alert>
        )}
        {error && (
          <Alert sx={{ marginTop: "20px" }} severity="error">
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default ResetPassword;
