import React from "react";
//import Grid from "@mui/material/Grid";
import {useEffect, useState} from "react";
import {queryAuthor} from '../services/sparqlRequests';
import {useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'

import './Books.css'
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { fetchBookInfo } from "../services/sparqlRequests";


function Author(data){  
    const navigate = useNavigate();
    const {authorURI} = useParams();
    const [authorInfo, setAuthorInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const  [listAwards, setListAwards] = useState(null);
    const [listBooks, setListBooks] = useState(null);
    const [listGenres, setListGenres] = useState(null);
    const [Books, setBooks] = useState([]);

    useEffect(() => {

        const loadAuthorInfo = async () => {
            setIsLoading(true);
            const response = await queryAuthor(authorURI);
            setAuthorInfo(response[0]);
            console.log("authorInfo  " + response[0]);
            setIsLoading(false);
            // initialise arrays
            setListAwards(splitString(response[0].listAwards.value));
            setListBooks(splitString(response[0].books.value));
            setListGenres(splitString(response[0].listGenres.value));
            
            for (let element of response[0].books.value.split(";")){
                console.log("this is the book" + element.split("/").pop());
                let responseBook = fetchBookInfo(element.split("/").pop());
                setBooks(Books => [...Books, responseBook]);
    }
            console.log("books " + Books);

        }
        loadAuthorInfo();
      
        
    }, [])

    useEffect(() => {
     
        setIsLoading(false);
        if(authorInfo !== null) {
            
        }
    }, [authorInfo])
    
    let splitString = (string) => {
            if (string !== null){
                return string.split(';');
            } 
    }

   

   

    const render = () => {
        

        return (
            <div>
                {authorInfo === null &&
                <div>
                    Loading results
                </div>}
                {authorInfo !== null && 

                <div className={"bookContainer"}>
                    <div className={"historyBack"}>
                        <button onClick={() => navigate(-1)}>go back</button>
                    </div>
                    <div className={"titleWrapper"}>
            
                        <Typography component="h1" variant="h1">
                            {authorInfo.name.value}
                        </Typography>
                        
                        <h3> {authorInfo.birthDate.value} </h3> - 
                        {authorInfo.deathDate === null && 
                        <div> Present </div>}
                        {authorInfo.deathDate !== null && <h3>{authorInfo.deathDate.value}</h3>}

                        
                        <div className={"mainContent"}>
                            <div className={"abstractWrapper"}>
                            <Typography component="h2" variant="h2">
                            Description
                        </Typography>
                                {authorInfo.description.value}
                            </div>
                            <div className={"imageWrapper"}>
                                <img src={authorInfo.image.value}/>
                            </div>
                        </div>
                        <div>
                            <h2>Info</h2>
                            <div className={"infoWrapper"}>
                                <div>
                                    Awards
                                </div>
                                <div>
                                    <ul>
                                    {listAwards !== null && 
                                        listAwards.map((award) => 
                                            <li key={award}>
                                                {award}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                <Typography component="h6" variant="h6">
                                    Description
                                </Typography>
                                </div>
                                <div>
                                    {authorInfo.occupation.value}
                                </div>
                                <div>
                                <Typography component="h6" variant="h6">
                                    Education
                                </Typography>
                                </div>
                                <div>
                                    {authorInfo.educ.value}
                                </div>

                                <div>

                                <Typography component="h6" variant="h6">
                                    Genres
                                </Typography>
                                </div>
                                <div>
                                  <ul>
                                    {listGenres !== null && 
                                        listGenres.map((genre) => 
                                            <li key={genre}>
                                                {genre}
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div>
                                <Typography component="h6" variant="h6">
                                    Books
                                </Typography>
                                </div>
                                <div>
                                        
                                </div>

                            </div>
                        </div>
                    
                    </div>
                </div>}
            </div>
        )
    }
    return (
        <div>
            {render()}
        </div>
    )

}

export default Author;