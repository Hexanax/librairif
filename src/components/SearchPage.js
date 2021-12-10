import * as React from "react";
import Box from "@mui/material/Box";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  autocompleteQuery,
  getAuthors,
  getBookSearch,
  getAuthorSearch,
} from "../services/sparqlRequests";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Results from "./Results";

import Lottie from "react-lottie";
import animationData from "../lotties/book-loading.json";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function SearchPage() {
  //used to push a new page to the history stack
  const [searchResults, setSearchResults] = useState([]);
  const [viewableResults, setViewableResults] = useState([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Set animation settings
   */
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  /**
   * Searches the list of corresponding books that match with textfield value
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const searchInput = data.get("search");
    setIsLoading(true);
    if (searchType === "Book") {
      const bookResponse = await getBookSearch(searchInput);
      setSearchResults(bookResponse);
      setViewableResults(bookResponse.slice(0, 50));
    } else if (searchType === "Author") {
      const authorResponse = await getAuthorSearch(searchInput);
      setSearchResults(authorResponse);
      setViewableResults(authorResponse.slice(0, 50));
    }
    setIsLoading(false);
  };
  /**
   * Searches the list of corresponding books that match with textfield value
   * @param {*} event
   */
  const handleNext = () => {
    setIsLoading(true);
    setOffset(offset + 1);
    setViewableResults(searchResults.slice(0, (offset + 1) * 50));
    setIsLoading(false);
  };

  //Autocomplete parameters (source :https://mui.com/components/autocomplete/)
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [highlightedOption, setHighlightedOption] = useState(0);
  const [searchType, setSearchType] = React.useState("Book");

  const loading = open && options.length === 0;

  /**
   * Searches the list of corresponding books and authors that match with textfield value
   * @param {*} event
   */
  const handleInputChange = async (event) => {
    event.preventDefault();
    const response = await autocompleteQuery(event.target.value);
    setOptions([...response]);
  };

  const handleSelectorChange = (event, newSearchType) => {
    if (newSearchType) {
      setSearchType(newSearchType);
      setSearchResults([]);
      setViewableResults([]);
      setInputValue("");
    }
  };

  const handleChange = async (event, newValue) => {
    event.preventDefault();
    setIsLoading(true);
    if (newValue.name === undefined) {
      setValue(newValue);
      setInputValue(newValue);
      const response = await getBookSearch(newValue);
      setSearchResults(response);
    } else {
      setValue(newValue.name.value);
      setInputValue(newValue.name.value);
      const response = await getBookSearch(newValue.name.value);
      setSearchResults(response);
    }
    setIsLoading(false);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "ArrowRight" && highlightedOption != null) {
      setInputValue(highlightedOption.name.value);
      setValue(highlightedOption.name.value);
    }

    if (event.key === "Enter") {
      if (highlightedOption === null) {
        event.defaultMuiPrevented = true;
      }
    }
  };

  useEffect(() => {
    if (!open) {
      setOptions([]);
    } else {
      (async () => {
        if (value.length > 0) {
          const response = await autocompleteQuery(value);
          setOptions([...response]);
        } else {
          setOptions([]);
        }
      })();
    }
  }, [open, value]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        mt: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 1,
      }}
    >
      <Box
        sx={{
          width: 1,
          display: "flex",
          flexDirection: "row ",
        }}
      >
        <Autocomplete
          freeSolo
          margin="normal"
          required
          fullWidth
          id="submit"
          name="submit"
          disableClearable
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            if (event != null && event.type === "change") {
              setInputValue(newInputValue);
              setValue(event.target.value);
              handleInputChange(event);
            }
          }}
          onChange={(event, newValue) => {
            handleChange(event, newValue);
          }}
          onKeyDown={(event) => {
            handleKeyDown(event);
          }}
          onHighlightChange={(event, option) => {
            setHighlightedOption(option);
          }}
          sx={{
            border: "1px solid #D8D8D8",
            boxSizing: "border-box",
            boxShadow: "0px 0px 8px rgba(135, 135, 135, 0.25)",
            borderRadius: 2,
            "&:hover": {
              boxShadow: "0px 0px 16px rgba(135, 135, 135, 0.25)",
            },
            height: 1,
          }}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          options={options.sort((a, b) =>
            a.type.value.localeCompare(b.type.value)
          )}
          groupBy={(option) => option.type.value}
          getOptionLabel={(option) => option.name?.value}
          loading={loading}
          renderInput={(params) => (
            <TextField
              id="search"
              name="search"
              label="Search your book by name or author"
              {...params}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option.name.value, inputValue);
            const parts = parse(option.name.value, matches);

            return (
              <li {...props}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
        />
        <ToggleButtonGroup
          color="primary"
          value={searchType}
          exclusive
          onChange={handleSelectorChange}
          sx={{
            pl: 2,
          }}
        >
          <ToggleButton value="Book">Books</ToggleButton>
          <ToggleButton value="Author">Author</ToggleButton>
        </ToggleButtonGroup>
      </Box>
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
        <InfiniteScroll
          dataLength={viewableResults.length} //This is important field to render the next data
          next={handleNext}
          hasMore={true}
          loader={
            isLoading ? (
              <Lottie options={defaultOptions} height={200} width={200} />
            ) : null
          }
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>End of results</b>
            </p>
          }
        >
          <Results type={searchType} data={viewableResults} />
        </InfiniteScroll>
      </Box>
    </Box>
  );
}
