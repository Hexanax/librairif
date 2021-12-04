import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

function BookResult(data) {
  return (
    <Card sx={{ width: 195, margin: 1 }}>
      <CardActionArea>
        <CardMedia component="img" image={data.img} alt="book cover" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {data.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.author}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BookResult;
