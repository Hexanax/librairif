import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BookResult from "./BookResult";

function SearchPage() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const searchInput = data.get("search");

    // eslint-disable-next-line no-console
    console.log({
      searchInput: searchInput,
    });
  };
  const data = {
    title: "Book Title",
    author: "Author Name",
    img: "http://commons.wikimedia.org/wiki/Special:FilePath/Atheïstisch_manifest.jpg?width=300",
  };
  var results = [
    BookResult(data),
    BookResult(data),
    BookResult(data),
    BookResult(data),
    BookResult(data),
  ];
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="search"
        label="Search book"
        name="search"
        autoFocus
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Search{" "}
      </Button>
      <Box
        sx={{
          display: "flex",
          flexWrap: "nowrap",
          p: 1,
          m: 1,
          bgcolor: "background.paper",
        }}
      >
        {results}
      </Box>
    </Box>
  );
}

export default SearchPage;
