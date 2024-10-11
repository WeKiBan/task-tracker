import { styled } from "@mui/material/styles";
import { Typography, Box, IconButton } from "@mui/material";

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color",
})(({ theme, color }) => ({
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  borderRight: `solid 0.6rem ${theme.palette.taskStatusColors[color]}`,
  borderRadius: "0.4rem",
  padding: "0.8rem",
  gap: "0.8rem",
  width: "100%",
  background: theme.palette.backgroundColors.white,
}));

export const TextWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flexGrow: 1,
  overflow: "hidden",
}));

export const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.darkGrey,
  fontSize: "1.4rem",
  lineHeight: "2rem",
}));

export const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}));

export const Button = styled(IconButton)(({ theme }) => ({
  padding: 0,
}));
