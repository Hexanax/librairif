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
      sx={{ minHeight: "100vh", minWidth: 2 / 3 }}
    >
      <Grid item>
        <Box
          sx={{
            minWidth: 600,
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            maxWidth: 500,
          }}
        >
          <Box
            sx={{
              width: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h1" sx={{ mb: 5 }}>
              LibrairIf
            </Typography>
            <SearchPage />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}