import {fetchEditorInfo} from '../services/sparqlRequests'
import "./Editor.css"
import {useEffect, useState} from "react";
import { useParams } from 'react-router';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Editor = () => {

    const [editorInfo, setEditorInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    let {editorURI} = useParams();

    useEffect(() => {

        const loadEditorInfo = async () => {
            setIsLoading(true);
            const response = await fetchEditorInfo(editorURI);
            console.log(response);
            setEditorInfo(response[0]);
            setIsLoading(false);
        }
        loadEditorInfo();
    }, []);

    useEffect(() => {
        console.log(editorInfo);
        setIsLoading(false)
    }, [editorInfo])

    const render = () => {
        return (
            <div>
                {editorInfo === null &&
                <div>
                    Loading results
                </div>}
                {editorInfo !== null &&

                <div className={"editorContainer"}>
                    <div className={"historyBack"}>
                        
                    </div>
                    <div className={"nameWrapper"}>
                        <h1 className={"editorName"}>
                            {editorInfo.label.value}
                        </h1>
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
                                {editorInfo.foundation.value !== "" ?
                                    <>
                                        <div className={"foundingYearWrapper"}>
                                            <span>Founded</span>
                                            <div>
                                                {editorInfo.foundation?.value.split(",")[0]}
                                            </div>
                                        </div>
                                    </>
                                    : null}
                                {editorInfo.countries.value !== "" ?
                                    <>
                                        <div className={"countriesWrapper"}>
                                            <span>Country</span>
                                            <div className={"countriesWrapper"}>
                                                {editorInfo.countries?.value.split(",")[0]}
                                            </div>
                                        </div>
                                    </>
                                    : null}
                                
                                {editorInfo.countries.value !== "" ?
                                    <>
                                       <div className={"founders"}>
                                        <span>Founders</span>
                                        <ul>
                                            {editorInfo.founders?.value.split(",").map(founder => <li>{founder.split("http://dbpedia.org/resource/")[1]} </li>)}
                                        </ul>
                                    </div>
                                    </>
                                    : null}                     
                                
                                
                            </div>
                        
                        <div>
                            <h2> Published Books</h2>
                            <div className={"publishedBooksWrapper"}>
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