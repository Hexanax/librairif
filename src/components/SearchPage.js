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
    const data = event.currentTarget;
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
    <Box noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="search"
        label="Search book"
        name="search"
        autoFocus
      />
      <Button
        onClick={handleSubmit}
        type="submit"
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
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
