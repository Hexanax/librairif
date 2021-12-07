import * as React from "react";
import Box from "@mui/material/Box";

import {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {researchQuery, autocompleteQuery} from "../services/sparqlRequests";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from "react-router-dom"

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import Results from "./Results";

/**
 * Allows to wait the time given
 * @param {int} delay time in ms
 * @returns
 */
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function SearchPage() {
  //used to push a new page to the history stack
  let navigate = useNavigate();
  const [bookTitle, setBookTitle] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Searches the list of corresponding books that match with textfield value
   * @param {*} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const searchInput = data.get("search");
    setIsLoading(true);
    const response = await researchQuery("", searchInput);
    console.log(response);
    setSearchResults(response);
    setIsLoading(false);
    console.log({
      searchInput: searchInput,
    });
  };

  //Autocomplete parameters (source :https://mui.com/components/autocomplete/)
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [highlightedOption, setHighlightedOption] = useState(0);

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

  const handleChange = async (event, newValue) => {
    event.preventDefault();
    setValue(newValue.name.value);
    setInputValue(newValue.name.value);
    setIsLoading(true);
    const response = await researchQuery(newValue.name.value, "");
    setSearchResults(response);
    setIsLoading(false);
  };

  const handleKeyDown = async (event) => {
    if (event.key === "ArrowRight" && highlightedOption != null) {
      setInputValue(highlightedOption.name.value);
      setValue(highlightedOption.name.value);
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
  }, [open]);

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
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
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
