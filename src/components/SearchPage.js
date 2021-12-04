import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BookResult from "./BookResult";
import Container from "./BookResult";
import { getSearchResults } from "../services/sparqlRequests";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    const data = new FormData(event.currentTarget);
    const searchInput = data.get("search");
    setIsLoading(true);
    const response = await getSearchResults();
    setSearchResults(response);
    setIsLoading(false);
    // eslint-disable-next-line no-console
    console.log({
      searchInput: searchInput,
    });
  };
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
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Search{" "}
      </Button>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "background.paper",
        }}
      >
        {searchResults.map((obj) => {
          const data = {
            title: obj.name.value,
            author: obj.authorName.value,
            img: obj.imageURL.value,
            releaseDate: obj.releaseDate.value,
          };
          return BookResult(data);
        })}
      </Box>
    </Box>
  );
}
