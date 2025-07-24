import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/placeholder.png";
import { useEffect  } from "react";
import { useSelector } from "react-redux";

const Landing = () => {
  const navigate = useNavigate();
  const { authToken, emailVerified } = useSelector((state) => state.auth);
  useEffect(() => {
    if (authToken && emailVerified) {
      navigate("/active-tasks");
    }
  }, [authToken, emailVerified, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "0 100px",
        gap: "50px",
      }}
      component="main"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "20px",
          flex: 1,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: "40px", fontWeight: 600 }}>
          TaskFlow for Efficient Task Management
        </Typography>
        <Typography sx={{ fontSize: "18px" }}>
          Organize and manage your development tasks effortlessly. Track project
          details, update task statuses, and leave notes all in one place.
          Transition seamlessly from active to completed tasks, with easy access
          to past notes and progress.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button
            size="large"
            onClick={() => navigate("/login")}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/register")}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          border: "#00000041 solid 30px",
          borderRadius: "10px",
        }}
      >
        <img style={{ maxWidth: "100%" }} src={placeholder} alt="placeholder" />
      </Box>
    </Box>
  );
};

export default Landing;
