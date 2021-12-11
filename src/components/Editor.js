import {fetchEditorBooks, getEditorInfo} from '../services/sparqlRequests'
import "./Editor.css"
import {useEffect, useState} from "react";
import {useParams} from 'react-router';
import BookResult from "./BookResult";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {CircularProgress, Typography} from "@mui/material";

const Editor = () => {

    const [editorInfo, setEditorInfo] = useState(null);
    const [editorBooks, setEditorBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    let {editorURI} = useParams();
    let navigate = useNavigate();

    useEffect(() => {

        const loadEditorInfo = async () => {
            setIsLoading(true);
            const response = await getEditorInfo(editorURI);
            if (response.length === 0) {
                setError(true);
            }
            console.log(response);
            setEditorInfo(response[0]);
            setIsLoading(false);
        }
        loadEditorInfo();
    }, []);

    useEffect(() => {
        console.log(editorInfo);
        setIsLoading(false)

        const loadEditorBooks = async () => {
            const response = await fetchEditorBooks(editorURI);
            console.log(response);
            setEditorBooks(response);
        }
        loadEditorBooks();
    }, [editorInfo])

    const render = () => {
        return (
            <div>
                {error && <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100vh"}>
                    <Typography fontWeight={"bold"} fontSize={"30px"}>
                        Resource not available
                    </Typography>
                </Box>}
                {editorInfo === null && !error &&
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={"100vh"}
                >
                    <CircularProgress/>
                </Box>}
                {editorInfo !== null && !error &&

                <div className={"editorContainer"}>
                    <div className={"historyBack"}>

                    </div>
                    <div className={"nameWrapper"}>
                        <h1 className={"editorName"}>
                            {editorInfo.name?.value}
                        </h1>
                        <h2>Info</h2>
                        <div className={"infoWrapper"}>
                            <div className={"founders"}>
                                Founders
                            </div>
                            <div>
                                <ul>
                                    {editorInfo.founders?.value.split(",").map(founder =>
                                        <li>{founder.split("http://dbpedia.org/resource/")[1]} </li>)}
                                </ul>
                            </div>
                            <div className={"foundingYearWrapper"}>
                                <span>Foundation Year</span>
                            </div>
                            <div>
                                {editorInfo.foundingYears?.value.split(",")[0]}
                            </div>
                            <div className={"headquartersWrapper"}>
                                <span>HeadQuarters</span>
                            </div>
                            <div>
                                {editorInfo.headquarters?.value.split(",")[0]}
                            </div>
                        </div>
                        <div className={"mainContent"}>
                            <div className={"abstractWrapper"}>
                                <h2>Abstract</h2>
                                {editorInfo.abstract?.value}
                            </div>

                        </div>
                        <div>
                            <h2> Published Books</h2>
                            <div className={"otherBooksWrapper"}>
                                {editorBooks.map((obj, index) => {
                                    const bookData = {
                                        title: obj.name?.value,
                                        author: obj.authorNames?.value,
                                        img: obj.imageUrl?.value,
                                        releaseDate: obj.releaseDate?.value,
                                        bookURI: obj.book?.value.split("http://dbpedia.org/resource/")[1],
                                    };
                                    return (
                                        <div className={"cardWrapper"}>
                                            <BookResult key={index} index={index} data={bookData}
                                                        navigate={navigate}/>
                                        </div>
                                    );
                                })
                                }
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

export default Editor;