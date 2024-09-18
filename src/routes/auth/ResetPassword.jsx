import { auth } from "../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const ResetPassword = () => {
  const [username, setUsername] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Reset form fields
    setUsername("");
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, username);
    } catch (err) {
      const errorCode = err.code;
      const errorMessage = err.message;
      console.log("An error has occured: ", errorCode, errorMessage);
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
        maxWidth: "300px",
        margin: "0 auto",
        marginTop: "100px",
      }}
      component="main"
      maxWidth="xs"
    >
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <Button
          onClick={handleReset}
          fullWidth
          variant="contained"
          color="primary"
        >
          Reset
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
