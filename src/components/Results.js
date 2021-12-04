import React, {useEffect, useState} from "react";
import { CardActionArea, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { researchQuery } from "../services/sparqlRequests";

export default function Results(props) {
    const [books, setBooks] = useState(props.books);
    useEffect(() => {
        const loadResults = async () => {
            const response = await researchQuery("The", "");
            console.log(response);
            setBooks(response.data.results.bindings);
        }
        loadResults();
    },[]);
    return (
        <Grid container spacing={5}
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start">
            {books.map((item, index) => (
                <Grid item key={index} >
                    <Card sx={{ maxWidth: 500, maxHeight: 500 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="300"
                                width="300"
                                image={item["callret-3"].value}
                                alt="miniature"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    { item.name.value }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    { item.author.value }
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}