import { styled } from "@mui/material/styles";
import { Typography, Box, IconButton } from "@mui/material";

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})(({ theme, status }) => ({
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  borderRight: `solid 0.6rem ${theme.palette.taskStatusColors[status]}`,
  borderRadius: "0.4rem",
  padding: "0.8rem 1.6rem",
  gap: "0.8rem",
  width: "100%",
  background: theme.palette.backgroundColors.white,
  "&:hover": {
    border: "solid 1px #000",
    borderRight: `solid 0.6rem ${theme.palette.taskStatusColors[status]}`,
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
  color: theme.palette.textColors.darkGrey,
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

export const Button = styled(IconButton)(() => ({
  padding: 0,
}));
