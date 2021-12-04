import React, {useEffect, useState} from "react";
import { CardActionArea, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { researchQuery } from "../services/sparqlRequests";
import BookResult from "./BookResult";

export default function Results({ books }) {
  //   useEffect(() => {
  //     const loadResults = async () => {
  //       const response = await researchQuery("The", "");
  //       console.log(response);
  //       setBooks(response.data.results.bindings);
  //     };
  //     loadResults();
  //   }, []);
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      {books.map((obj, index) => {
        const data = {
          title: obj.name.value,
          author: obj.authorName.value,
          img: obj["callret-4"].value,
          releaseDate: obj.releaseDate.value,
        };
        return BookResult(index, data);
      })}
    </Grid>
  );
}