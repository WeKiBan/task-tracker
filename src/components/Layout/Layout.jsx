import { Box } from "@mui/material";
import NavBar from "../Nav/Nav";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Layout({ children }) {
  const { authToken, emailVerified } = useSelector((state) => state.auth);
  const location = useLocation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxHeight: "100%",
      }}
    >
      {location.pathname === "/tasks" && authToken && emailVerified && (
        <NavBar />
      )}
      {location.pathname === "/" && <NavBar />}
      {children}
    </Box>
  );
}
