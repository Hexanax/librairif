import {getBookInfo} from '../doctrine/sparqlRequests'
import {useEffect, useState} from "react";

const Books = ({wikiPageId}) => {

    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const loadBookInfo = async() => {
            setIsLoading(true);
            const response = await getBookInfo(wikiPageId);
            setBookInfo(response)
            setIsLoading(false);
        }
        loadBookInfo();
    },[])

    useEffect(() => {
        console.log(bookInfo);
        setIsLoading(false)
    },[bookInfo])

    const render = () =>{
        return(
            <div>

            </div>
        )
    }
}

export default Books