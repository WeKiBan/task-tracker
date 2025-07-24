import {
  TextField as TextFieldComponent,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
}));

export const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.textColors.darkGrey,
  fontSize: "1.6rem",
  lineHeight: "3.2rem",
  paddingLeft: "0.8rem",
  borderBottom: `1px solid ${theme.palette.borderColors.lightGrey}`,
}));

export const TextField = styled(TextFieldComponent)(({ theme }) => ({
  width: "100%",
  fontSize: "1.6rem",
  background: theme.palette.backgroundColors.white,
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "1.6rem",
  },
}));
