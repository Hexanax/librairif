import {getBookInfo, getAssociatedGames, getAssociatedMovies, getAssociatedMusicals,
    getAssociatedSeries, getAssociatedArts, getAssociatedMusics , getListInSeries,
    getBookNeighbor} from '../services/sparqlRequests'
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import './Books.css'
import {useNavigate} from 'react-router-dom'

const Books = () => {

    let {bookURI} = useParams();
    let navigate = useNavigate();
    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [associatedGames, setAssociatedGames] = useState(null);
    const [associatedMovies, setAssociatedMovies] = useState(null);
    const [associatedMusicals, setAssociatedMusicals] = useState(null);
    const [associatedSeries, setAssociatedSeries] = useState(null);
    const [associatedArts, setAssociatedArts] = useState(null);
    const [associatedMusics, setAssociatedMusics] = useState(null);

    const [seriesOfBook, setSeriesOfBook] = useState(null);
    const [neighbors, setNeighbors] = useState(null);

    useEffect(() => {

        const loadBookInfo = async () => {
            setIsLoading(true);
            const response = await getBookInfo(bookURI);
            setBookInfo(response[0])
            setIsLoading(false);
        }

        (async () => {
            await loadBookInfo();
          })();
    }, []);

    useEffect(() => {
        const loadAssociatedWork = async () => {
            setIsLoading(true);
            if(bookInfo !== null) {
                const games = await getAssociatedGames(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedGames(games);

                const movies = await getAssociatedMovies(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedMovies(movies);

                const musicals = await getAssociatedMusicals(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedMusicals(musicals);

                const series = await getAssociatedSeries(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedSeries(series);

                const arts = await getAssociatedArts(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedArts(arts);

                const musics = await getAssociatedMusics(bookInfo.name.value, bookInfo.authorName.value);
                setAssociatedMusics(musics);
            }
            setIsLoading(false);
        }
        const loadAssociatedSeriesOfBook = async () => {
            setIsLoading(true);
            const response = await getListInSeries(bookURI);
            setSeriesOfBook(response);
            setIsLoading(false);
        }
        const loadBookNeighbors = async () => {
            setIsLoading(true);
            const response = await getBookNeighbor(bookURI);
            setNeighbors(response);
            setIsLoading(false);
        }

        (async () => {
            await loadAssociatedWork();
            await loadAssociatedSeriesOfBook();
            await loadBookNeighbors();
          })();
    }, [bookInfo])

    useEffect(() => {
        console.log(bookInfo);
        console.log(associatedGames);
        console.log(associatedMovies);
        console.log(associatedMusicals);
        console.log(associatedSeries);
        console.log(associatedArts);
        console.log(associatedMusics);
        console.log(seriesOfBook);
        console.log(neighbors);
        setIsLoading(false)
    }, [bookInfo, associatedGames, associatedMovies, 
        associatedMusicals, associatedSeries, associatedArts,
        associatedMusics, seriesOfBook, neighbors]) 

    const render = () => {
        return (
            <div>
                {bookInfo === null &&
                <div>
                    Loading results
                </div>}
                {bookInfo !== null &&

                <div className={"bookContainer"}>
                    <div className={"historyBack"}>
                        <button onClick={() => navigate(-1)}>go back</button>
                    </div>
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