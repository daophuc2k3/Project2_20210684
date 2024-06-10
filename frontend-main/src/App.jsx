import { ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMemo } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "./app/store";
import router from "./routes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: light)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Toaster richColors position="top-right" />
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </LocalizationProvider>
    </HelmetProvider>
  );
}

export default App;
