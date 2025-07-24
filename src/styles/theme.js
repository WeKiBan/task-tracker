// theme.js
import { createTheme } from "@mui/material/styles";
import { STATUS_COLORS } from "../config/constants";
const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
    },
    textColors: {
      darkGrey: "#4B505D",
      lightGrey: "#4B505D80",
      white: "#fff",
    },
    taskStatusColors: {
      ...STATUS_COLORS,
    },
    projectTypeColors: {
      js: "#EE8434",
      html: "#7FB069",
      css: "#1976d2",
      multi: "#C95D63",
      config: "#AE8799",
    },
    backgroundColors: {
      darkGrey: "#A7A7A71A",
      mediumGrey: "#F7F9FD",
      white: "#fff",
    },
    borderColors: {
      darkGrey: "#4B505D",
      lightGrey: "#4B505D80",
    },
    buttonColors: {
      blue: "#308FFF",
    },
  },
});

export default theme;
