import {getBookInfo} from '../services/sparqlRequests'
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
const Books = () => {

    let { bookURI } = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const loadBookInfo = async () => {
            setIsLoading(true);
            const response = await getBookInfo(bookURI);
            setBookInfo(response)
            setIsLoading(false);
        }
        loadBookInfo();
    }, []);

    useEffect(() => {
        console.log(bookInfo);
        setIsLoading(false)
    }, [bookInfo])

    const render = () => {
        return (
            <div>
                {!bookInfo &&
                <div>
                    Loading results
                </div>}
                {bookInfo &&
                <div>
                    {JSON.stringify(bookInfo)}
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

export default Books