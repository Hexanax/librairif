import Browser from "./components/Browser";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { lightTheme } from "./themes/lightTheme";
import * as React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Books from "./components/Books";
import Results from "./components/Results";

export default function App() {
  const theme = createTheme(lightTheme);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Router>
            <div>
                <Routes>
                    <>
                        <Route path="/" element={<Browser/>}>
                        </Route>
                        <Route path="/bookSearch/:searchInput" element={<Results/>}>
                        </Route>
                        <Route path="/bookInfo/:bookURI" element={<Books/>}>
                        </Route>
                    </>
                </Routes>
            </div>
        </Router>
    </ThemeProvider>
  );
}
