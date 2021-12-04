import Browser from "./components/Browser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme } from "./themes/lightTheme";

export default function App() {
  const theme = createTheme(lightTheme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Browser />
    </ThemeProvider>
  );
}
