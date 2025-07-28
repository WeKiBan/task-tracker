import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100%",
  background: theme.palette.backgroundColors.mediumGrey,
}));

export const Container = styled(Box)(
  ({ theme, flexDirection, justifyContent, padding }) => ({
    display: "flex",
    flexDirection: flexDirection || "row",
    justifyContent: justifyContent || "flex-start",
    flex: "100%",
    height: "100%",
    gap: theme.spacing(2),
    padding: padding || "",
    background: theme.palette.backgroundColors.lightGrey,
    borderRadius: theme.shape.borderRadius,
    minHeight: 0,
    minWidth: 0,
  }),
);

export const Column = styled(Box)(({ theme, flexamount }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  flex: flexamount || 1,
  background: theme.palette.backgroundColors.lightGrey,
  borderRadius: theme.shape.borderRadius,
}));
