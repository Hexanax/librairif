import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Books from "./Books";
import SearchPage from "./SearchPage";

export default function Browser() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      book: data.get("searchBook"),
    });
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            ml: 4,
            mr: 4,
            ml: 8,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h1">
              LibrairIf
            </Typography>
            <SearchPage />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}