import * as React from "react";
import { CardActionArea, Grid, Card, CardContent, CardMedia, Typography, Divider } from '@mui/material';


let books = [{ name: 'Le prince', author: 'Nicolas Machiavel', img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Machiavelli_Principe_Cover_Page.jpg/300px-Machiavelli_Principe_Cover_Page.jpg" },
    { name: 'Le prince', author: 'Nicolas Machiavel', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Machiavelli_Principe_Cover_Page.jpg/300px-Machiavelli_Principe_Cover_Page.jpg' },
    { name: 'Le prince', author: 'Nicolas Machiavel', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Machiavelli_Principe_Cover_Page.jpg/300px-Machiavelli_Principe_Cover_Page.jpg' }
    ];
export default function Results() {
    
    return (
        <Grid container spacing={5}
            direction="row"
            justifyContent="space-around"
            alignItems="flex-start">
            {books.map((item, index) => (
                <Grid item key={index} >
                    <Card sx={{ maxWidth: 600, maxHeight: 1000 }}>
                        <CardActionArea>
                            <CardMedia
                                component="img"
                                height="300"
                                image={item.img}
                                alt="miniature"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    { item.name }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    { item.author }
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}