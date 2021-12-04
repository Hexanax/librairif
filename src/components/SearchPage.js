import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BookResult from "./BookResult";
import { researchQuery } from "../services/sparqlRequests";
import Results from "./Results";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    const data = new FormData(event.currentTarget);
    const searchInput = data.get("search");
    setIsLoading(true);
    const response = await researchQuery(searchInput, "");
    setSearchResults(response);
    setIsLoading(false);
    // eslint-disable-next-line no-console
    console.log({
      searchInput: searchInput,
    });
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 1,
        width: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="search"
        name="search"
        sx={{
          border: "1px solid #D8D8D8",
          boxSizing: "border-box",
          boxShadow: "0px 0px 8px rgba(135, 135, 135, 0.25)",
          borderRadius: 2,
          "&:hover": {
            boxShadow: "0px 0px 16px rgba(135, 135, 135, 0.25)",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        endIcon={<SearchIcon />}
        sx={{ mt: 3, mb: 2, width: "300px" }}
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
        <Results books={searchResults} />
      </Box>
    </Box>
  );
}
