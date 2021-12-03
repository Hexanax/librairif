import {getBookInfo} from '../services/sparqlRequests'
import {useEffect, useState} from "react";

const Books = ({resourceURI}) => {

    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const loadBookInfo = async () => {
            setIsLoading(true);
            const response = await getBookInfo(resourceURI);
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
                {isLoading &&
                <div>

                </div>}
                {!isLoading &&
                <div>
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