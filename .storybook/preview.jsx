import { ThemeProvider } from "@mui/material/styles";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../src/redux/store";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/styles/theme";
import "../src/styles/global.css";

const preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <MemoryRouter>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: theme.palette.backgroundColors.mediumGrey,
                height: "100vh",
                width: "100vw",
              }}
            >
              <Story />
            </div>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
