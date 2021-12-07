import {
    fetchBookInfo, fetchAssociatedGames, fetchAssociatedMovies, fetchAssociatedMusicals,
    fetchAssociatedSeries, fetchAssociatedArts, fetchAssociatedMusics, fetchListInSeries,
    fetchBookNeighbor
} from '../services/sparqlRequests'
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import './Books.css'
import {useNavigate} from 'react-router-dom'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import * as React from "react";
import Game from "./Game";
import Movie from "./Movie";

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
            const response = await fetchBookInfo(bookURI);
            console.log(response);
            setBookInfo(response[0])
            setIsLoading(false);
        }

        loadBookInfo();
    }, [bookURI]);

    useEffect(() => {
        const loadAssociatedWork = async () => {
            setIsLoading(true);
            if (bookInfo !== null) {
                const games = await fetchAssociatedGames(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedGames(games);
                const movies = await fetchAssociatedMovies(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedMovies(movies);
                const musicals = await fetchAssociatedMusicals(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedMusicals(musicals);
                const series = await fetchAssociatedSeries(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedSeries(series);
                const arts = await fetchAssociatedArts(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedArts(arts);
                const musics = await fetchAssociatedMusics(bookInfo.name.value, bookInfo.authorName?.value);
                setAssociatedMusics(musics);
            }
            setIsLoading(false);
        }
        const loadAssociatedSeriesOfBook = async () => {
            setIsLoading(true);
            const response = await fetchListInSeries(bookURI);
            setSeriesOfBook(response);
            setIsLoading(false);
        }
        const loadBookNeighbors = async () => {
            setIsLoading(true);
            const response = await fetchBookNeighbor(bookURI);
            setNeighbors(response);
            setIsLoading(false);
        }

        (async () => {
            await loadAssociatedWork();
            await loadAssociatedSeriesOfBook();
            await loadBookNeighbors();
        })();
    }, [bookInfo, bookURI])

    useEffect(() => {
        console.log("Book infos : ")
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
                            <span className={"author"}>{bookInfo.authorName ? bookInfo.authorName.value :
                                bookInfo.authorURI?.value }</span>
                        </div>
                        <div className={"mainContent"}>
                            <div className={"abstractWrapper"}>
                                <h2>Abstract</h2>
                                {bookInfo.abstract.value}
                            </div>
                            <div className={"imageWrapper"}>
                                {bookInfo.imageURL ?
                                    <img src={bookInfo.imageURL.value}/> :
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
                                            {bookInfo.name.value}
                                        </Typography>
                                        <Typography variant="body2" color="#DBDBDB">
                                            {bookInfo.authorName?.value}
                                        </Typography>
                                    </Box>}
                            </div>
                        </div>
                        <div style={{'margin-bottom':'10px'}}>
                            <h2>Info</h2>
                            <div className={"infoWrapper"}>
                                {bookInfo.publishers.value!=="" ?
                                    <>
                                        <div className={"publishersWrapper"}>
                                            Publishers
                                        </div>
                                        <div className={"publishersWrapper"}>
                                            {bookInfo.publishers.value}
                                        </div>
                                    </>
                                    : null}
                                {bookInfo.releaseDates.value!=="" ?
                                    <>
                                        <div className={"releaseDateWrapper"}>
                                            <span>Release Date</span>
                                        </div>
                                        <div className={"releaseDateWrapper"}>
                                            {bookInfo.releaseDates.value}
                                        </div>
                                    </> : null}
                                {bookInfo.titleOrig ?
                                    <>
                                        <div className={"titleOrig"}>
                                            <span>Original Title</span>
                                        </div>
                                        <div className={"titleOrig"}>
                                            <span> {bookInfo.titleOrig.value}</span>
                                        </div>
                                    </> : null}
                                {bookInfo.genres ?
                                    <>
                                        <div className={"literaryGenres"}>
                                            <span>Literary genres</span>
                                        </div>
                                        <div className={"literaryGenres"}>
                                            <span> {bookInfo.genres.value}</span>
                                        </div>
                                    </> : null}
                            </div>
                        </div>
                        <div>
                            <div className={"relatedWrapper"}>
                                <h3>Related Games</h3>
                                {associatedGames !== null && associatedGames.map(game => <Game game={game}/>)}
                            </div>
                            <div className={"relatedWrapper"}>
                                <h3>Related Movies</h3>
                                {associatedMovies !== null && associatedMovies.map(movie => <Movie movie={movie}/>)}
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