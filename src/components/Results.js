import React, { useEffect, useState } from "react";
import {
  CardActionArea,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { researchQuery } from "../services/sparqlRequests";
import BookResult from "./BookResult";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Results({ books }) {
  let { searchInput } = useParams();
  let navigate = useNavigate();
  const [books, setBooks] = useState(null);

  useEffect(() => {
    const loadResults = async () => {
      const response = await researchQuery(searchInput, "");
      console.log(response);
      setBooks(response);
    };
    loadResults();
    console.log(books);
  }, []);

  return (
    <div>
      {books === null ? (
        <div>Loading</div>
      ) : books.length === 0 ? (
        <div>No results</div>
      ) : (
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {books.map((obj, index) => {
            const data = {
              title: obj.name.value,
              author: obj.authorName.value,
              img: obj.imageUrl.value,
              releaseDate: obj.releaseDate.value,
              bookURI: obj.book.value.split("http://dbpedia.org/resource/")[1],
            };
            return BookResult(index, data, navigate);
          })}
        </Grid>
      )}
    </div>
  );
}
