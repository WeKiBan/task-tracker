import { styled } from "@mui/material/styles";
import { Button as ButtonComponent } from "@mui/material";
import { Add } from "@mui/icons-material";

export const Button = styled(ButtonComponent, {
  shouldForwardProp: (prop) => prop !== "height",
})(({ theme, height }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: `2px dashed ${theme.palette.textColors.lightGrey}`,
  width: "100%",
  height: height,
}));

export const AddIcon = styled(Add, {
  shouldForwardProp: (prop) => prop !== "iconSize",
})(({ theme, iconSize }) => ({
  width: iconSize,
  height: iconSize,
  color: theme.palette.textColors.lightGrey,
}));
