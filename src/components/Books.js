import {getBookInfo} from '../services/sparqlRequests'
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import './Books.css'

const Books = () => {

    let {bookURI} = useParams();
    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        const loadBookInfo = async () => {
            setIsLoading(true);
            const response = await getBookInfo(bookURI);
            setBookInfo(response[0])
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
                {bookInfo === null &&
                <div>
                    Loading results
                </div>}
                {bookInfo !== null &&
                <div className={"bookContainer"}>
                    <div className={"titleWrapper"}>
                        <h1 className={"bookTitle"}>
                            {bookInfo.name.value}
                        </h1>
                        <div className={"authorWrapper"}>
                            <span className={"author"}>{bookInfo.authorURI.value}</span>
                        </div>
                        <div className={"mainContent"}>
                            <div className={"abstractWrapper"}>
                                <h2>Abstract</h2>
                                {bookInfo.abstract.value}
                            </div>
                            <div className={"imageWrapper"}>
                                <img src={bookInfo.imageURL.value}/>
                            </div>
                        </div>
                        <div>
                            <h2>Info</h2>
                            <div className={"infoWrapper"}>
                                <div className={"publishersWraooer"}>
                                    Publishers
                                </div>
                                <div>
                                    {bookInfo.publisherURI.value}
                                </div>
                                <div className={"releaseDateWrapper"}>
                                    <span>Release Date</span>
                                </div>
                                <div>
                                    {bookInfo.releaseDate.value}
                                </div>
                                <div className={"titleOrig"}>
                                    <span>Original Title</span>
                                </div>
                                <div>
                                    <span>{bookInfo.titleOrig.value}</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2> Related Books</h2>
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

export default Books