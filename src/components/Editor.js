import {getEditorInfo} from '../services/sparqlRequests'
import {useEffect, useState} from "react";

const Editor = ({resourceURI}) => {

    const [editorInfo, setEditorInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const loadEditorInfo = async () => {
            setIsLoading(true);
            const response = await getEditorInfo(resourceURI);
            setEditorInfo(response);
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
                    <button onClick={() => navigate(-1)}>Go back</button>
                </div>
                <div className={"nameWrapper"}>
                    <h1 className={"editorName"}>
                        {editorInfo.name.value}
                    </h1>
                    <h2>Info</h2>
                        <div className={"infoWrapper"}>
                            <div className={"founders"}>
                                Founders
                            </div>
                            <div>
                                {editorInfo.founders.value}
                            </div>
                            <div className={"foundingYearWrapper"}>
                                <span>Foundation Year</span>
                            </div>
                            <div>
                                {editorInfo.foundingYear.value}
                            </div>
                        </div>
                    <div className={"founderWrapper"}>
                        <span className={"founder"}>{editorInfo.founderURI.value}</span>
                    </div>
                    <div className={"mainContent"}>
                        <div className={"abstractWrapper"}>
                            <h2>Abstract</h2>
                            {editorInfo.abstract.value}
                        </div>
                        <div className={"imageWrapper"}>
                            <img src={editorInfo.imageURL.value}/>
                        </div>
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        <h2> Published Books</h2>
                        <div className={"relatedWrapper"}>
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