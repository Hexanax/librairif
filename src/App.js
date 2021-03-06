import Browser from "./components/Browser";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {lightTheme} from "./themes/lightTheme";
import * as React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Books from "./components/Books";
import Editor from "./components/Editor";
import Results from "./components/Results";
import Author from "./components/Author";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
    const theme = createTheme(lightTheme);
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div>
            <Navbar />
            <ScrollToTop />
            <Routes>
              <>
                <Route path="/librairif/" element={<Browser />}></Route>
                <Route
                  path="/librairif/bookSearch/:searchInput"
                  element={<Results />}
                ></Route>
                <Route
                  path="/librairif/bookInfo/:bookURI"
                  element={<Books />}
                ></Route>
                <Route
                  path="/librairif/authorInfo/:authorURI"
                  element={<Author />}
                ></Route>
                <Route
                  path="/librairif/editorInfo/:editorURI"
                  element={<Editor />}
                ></Route>
              </>
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    );
}
