import { styled } from "@mui/material/styles";
import { Typography, Box, IconButton } from "@mui/material";

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})(({ theme, type }) => ({
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  background:
    theme.palette.projectTypeColors[type.toLowerCase()] ||
    theme.palette.projectTypeColors.default,
  borderRadius: "0.4rem",
  padding: "0.8rem 1.6rem",
  gap: "0.8rem",
  width: "100%",
  "&:hover": {
    border: "solid 1px #000",
  },
}));

export const TextWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flexGrow: 1,
  overflow: "hidden",
}));

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.white,
  fontSize: "1.4rem",
  lineHeight: "2rem",
  fontWeight: "600",
}));

export const ButtonWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}));

export const Button = styled(IconButton)(({ theme }) => ({
  padding: 0,
  color: theme.palette.textColors.white,
}));
