import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import BookResult from "./BookResult";
import { useNavigate } from "react-router-dom";
import AuthorResult from "./AuthorResult";

export default function Results({ type, data }) {
  let navigate = useNavigate();

  return (
    <div>
      {data === null ? (
        <div>Loading</div>
      ) : data.length === 0 ? (
        <div></div>
      ) : (
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-start"
        >
          {type=='Book' && data.map((obj, index) => {
            const bookData = {
              title: obj.name.value,
              author: obj.authorNames.value,
              img: obj.imageUrl?.value,
              releaseDate: obj.releaseDate?.value,
              bookURI: obj.book.value.split("http://dbpedia.org/resource/")[1],
            };
            return BookResult(index, bookData, navigate);
          })}
          {type=='Author' && data.map((obj, index) => {
            const authorData = {
              name: obj.name.value,
              img: obj.imageUrl?.value,
              birthDate: obj.birthDate?.value ?? '',
              deathDate: obj.deathDate?.value ?? '',
              authorURI: obj.writer.value.split("http://dbpedia.org/resource/")[1],
            };
            return AuthorResult(index, authorData, navigate,null);
          })}
        </Grid>
      )}
    </div>
  );
}
