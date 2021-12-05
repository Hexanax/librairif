import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchPage from "./SearchPage";

export default function Browser() {

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