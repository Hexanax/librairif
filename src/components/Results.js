import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import BookResult from "./BookResult";
import { useNavigate } from "react-router-dom";

export default function Results({ books }) {
  let navigate = useNavigate();

  return (
    <div>
      {books === null ? (
        <div>Loading</div>
      ) : books.length === 0 ? (
        <div></div>
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
              img: obj.imageUrl?.value,
              releaseDate: obj.releaseDate?.value,
              bookURI: obj.book.value.split("http://dbpedia.org/resource/")[1],
            };
            return BookResult(index, data, navigate);
          })}
        </Grid>
      )}
    </div>
  );
}
