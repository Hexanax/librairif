import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {CardActionArea, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";

function BookResult(index, data, navigate) {


    const handleClick = () => {
        console.log("click");
        navigate(`../../bookInfo/${data.bookURI}`);
    }
    return (
            <Grid onClick={() => handleClick()} item key={index}>
                <Card>
                    <CardActionArea sx={{height: 430, width: 195}}>
                        <CardMedia
                            component="img"
                            height="250"
                            image={data.img}
                            alt="miniature"
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {data.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {data.author} - {data.releaseDate}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
    );
}

export default BookResult;
