import { styled } from "@mui/material/styles";
import { Typography, Box, IconButton } from "@mui/material";

export const Wrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "status",
})(({ theme, isSelected, status }) => ({
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",
  borderLeft: `solid 1rem ${theme.palette.taskStatusColors[status]}`,
  borderRadius: "0.4rem",
  padding: "1.6rem 1rem 1.6rem 1.6rem",
  gap: "1.6rem",
  width: "100%",
  background: isSelected
    ? theme.palette.backgroundColors.white
    : theme.palette.backgroundColors.darkGrey,
  "&:hover": {
    border: "solid 1px #000",
    borderLeft: `solid 1rem ${theme.palette.taskStatusColors[status]}`,
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
  fontSize: "1.6rem",
  lineHeight: "2.4rem",
  fontWeight: "600",
}));

export const Description = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.lightGrey,
  fontSize: "1.2rem",
  lineHeight: "1.6rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

export const ButtonWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
}));

export const Button = styled(IconButton)(() => ({
  padding: 0,
}));
