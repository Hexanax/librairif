import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CardActionArea, Grid } from "@mui/material";

function dateFormat(date) {
  if (date != null && date.split('-')[0] != '') {
    return date.split('-')[0];
  } else {
    return '';
  }
}

function AuthorResult(index, data, navigate) {
  const handleClick = () => {
    navigate(`../../bookInfo/${data.authorURI}`);
  };
  // uri, nom date naissance, date mort, thumbnail
  let authorCover;
  if (data.img) {
    authorCover = (
      <CardMedia
        component="img"
        image={data.img}
        alt="miniature"
        sx={{
          borderRadius: 2,
          height: 2 / 3,
          width: "100%",
          filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25))",
        }}
      />
    );
  } else {
    authorCover = (
      <Box
        sx={{
          pt: 8,
          pr: 2,
          pl: 1,
          borderRadius: 2,
          backgroundColor: "#2F2F2F",
          height: 2 / 3,
          width: "100%",
          filter: "drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.25))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          color="primary.contrastText"
        >
          {data.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid onClick={() => handleClick()} item key={index}>
      <Card elevation={0}>
        <CardActionArea sx={{ height: 500, width: 195 }}>
          {authorCover}
          <CardContent sx={{ height: 1 / 3, width: "100%" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ textOverflow: "ellipsis" }}
            >
              {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.birthDate ? dateFormat(data.birthDate) : ""} {data.deathDate && dateFormat(data.deathDate) != '' ? (" - " + dateFormat(data.deathDate)) : ""}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default AuthorResult;
