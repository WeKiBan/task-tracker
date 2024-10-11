// theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    textColors: {
      darkGrey: "#4B505D",
      lightGrey: "#4B505D80",
    },
    taskStatusColors: {
      inDev: "#EE8434",
      inProd: "#7FB069",
      inProgress: "#1976d2",
      blocked: "#C95D63",
      closed: "#AE8799",
    },
    backgroundColors: {
      darkGrey: "#A7A7A71A",
      mediumGrey: "#F7F9FD",
      white: "#fff",
    },
  },
});

export default theme;
