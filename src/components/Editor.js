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
                {
                    isLoading &&
                    <div>

                    </div>
                }
                {
                    !isLoading &&
                    <div>

                    </div>
                }
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