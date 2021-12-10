import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {CardActionArea, Grid} from "@mui/material";

function BookResult({index, data, navigate}) {
    const handleClick = () => {
        console.log("click");
        navigate(`../../bookInfo/${data.bookURI}`);
    };
    let bookCover;
    if (data.img) {
      bookCover = (
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
      bookCover = (
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
            sx={{ textOverflow: "ellipsis" }}
          >
            {data.title}
          </Typography>
          <Typography variant="body2" color="#DBDBDB">
            {data.author}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid onClick={() => handleClick()} item key={index}>
        <Card elevation={0}>
          <CardActionArea sx={{ height: 500, width: 195 }}>
            {bookCover}
            <CardContent sx={{ height: 1 / 3, width: "100%" }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ textOverflow: "ellipsis" }}
              >
                {data.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.author} {data.releaseDate ? " - " + data.releaseDate : ""}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );
}

export default BookResult;
