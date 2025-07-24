import { styled } from "@mui/material/styles";
import { Toolbar as ToolbarComponent, Typography, Box } from "@mui/material";
import { Settings, Logout, Mail } from "@mui/icons-material";

export const Toolbar = styled(ToolbarComponent)(({ theme }) => ({
  justifyContent: "space-between",
  background: theme.palette.backgroundColors.white,
  color: theme.palette.textColors.darkGrey,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.borderColors.lightGrey}`,
}));

export const TextButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "1.6rem",
}));

export const TextButton = styled(Box)(({ theme, isActive }) => ({
  display: "flex",
  width: "100%",
  whiteSpace: "nowrap",
  fontSize: "1.6rem",
  textTransform: "capitalize",
  padding: "0",
  borderBottom: `${isActive ? "1px" : "0"} solid ${theme.palette.textColors.darkGrey}`,
  borderRadius: 0,
  cursor: "pointer",
}));

export const LogoText = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
}));

export const IconButtonContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "10px",
}));

export const SettingsIcon = styled(Settings)(({ theme }) => ({
  fontSize: "2.4rem",
}));

export const LogoutIcon = styled(Logout)(({ theme }) => ({
  fontSize: "2rem",
}));
export const MailIcon = styled(Mail)(({ theme }) => ({
  fontSize: "2rem",
}));
