
import {fetchEditorInfo, fetchEditorBooks, fetchRelatedEditors} from '../services/sparqlRequests'
import "./Editor.css"
import {useEffect, useState} from "react";
import { useParams } from 'react-router';
import Box from "@mui/material/Box";
import BookResult from "./BookResult";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import {CircularProgress, Link, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ArrowBackRounded from "@bit/mui-org.material-ui-icons.arrow-back-rounded";



const Editor = () => {

    const [editorInfo, setEditorInfo] = useState(null);
    const [editorBooks, setEditorBooks] = useState([]);
    const [relatedEditors, setRelatedEditors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    let {editorURI} = useParams();
    let navigate = useNavigate();

    useEffect(() => {

        const loadEditorInfo = async () => {
            setIsLoading(true);
            const response = await fetchEditorInfo(editorURI);
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

    useEffect(() => {
        
        setIsLoading(false)

        const loadRelatedEditors = async () => {
            const response = await fetchRelatedEditors(editorURI);
            setRelatedEditors(response);
        }
        loadRelatedEditors();
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
                            <IconButton
                                onClick={() => {
                                    navigate(-1);
                                }}
                                aria-label="delete"
                                size="large"
                            >
                                <ArrowBackRounded fontSize="inherit"/>
                            </IconButton>
                    </div>
                    <div className={"nameWrapper"}>
                        <h1 className={"editorName"}>
                            {editorInfo.label.value}
                        </h1>
                    </div>
                    <div className={"mainContent"}>
                        <div className={"abstractWrapper"}>
                            <h2>Abstract</h2>
                            {editorInfo.abstract?.value}
                        </div>
                        
                        <div className={"imageWrapper"}>
                            {editorInfo.imageURL ?
                                <img src={editorInfo.imageURL.value}/> :
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
                                            {editorInfo.label.value}
                                    </Typography>
                                        
                                </Box>}
                        </div>
                        
                    </div>
                    <h2>Info</h2>
                    <div className={"infoWrapper"}>
                            
                            {editorInfo.countries.value !== "" ?
                                    <>
                                        <div className={"valueWrapper"}>
                                            <span>Country</span>
                                        
                                        </div>
                                        <span className={"value"}>
                                                {editorInfo.countries?.value.split(",")[0]}
                                        </span>
                                    </>
                                    : null}
                                    
                                {editorInfo.foundation.value !== "" ?
                                    <>                            
                                        <div className={"valueWrapper"}>
                                            <span>Founded</span>
                                            
                                        </div>     
                                        <span className={"valueWrapper"}>
                                                {editorInfo.foundation?.value.split(",")[0]}
                                        </span>                                   
                                    </>
                                    : null}
                                
                                
                                {editorInfo.founders.value !== "" ?
                                    <>
                                    <div className={"valueWrapper"}>
                                            <span>Founders</span>
                                        </div>
                                        <div>
                                                {editorInfo.founders?.value.split(",").map(founder => <span className="founder">{founder.split("http://dbpedia.org/resource/")[1]} </span>)}
                                        </div>
                                    </>
                                    : null}                     
                                    
                                    
                    </div>
                    <div>
                        <h2> Published Books</h2>
                        <div className={"otherResourceWrapper"}>
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
                    { editorInfo.countries !== null && !error &&

                    
                    <div>
                        <h2> More Editors From {editorInfo.countries?.value.split(",")[0]}</h2>
                        <div className={"relatedEditors"}>
                            {relatedEditors.map((obj, index) => {
                                const editorsData = {
                                    name: obj.publisher?.value.split("http://dbpedia.org/resource/")[1],
                                };
                                return (
                                    <div>
                                        <span className={"editor"}>
                                            { (
                                                <a href={`../../editorInfo/${editorsData.name}`}>
                                                    {" "}
                                                    {editorsData.name}
                                                </a>
                                            )}
                                        </span>
                                    </div>
                                );
                            })
                            }
                        </div>
                    </div>}

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