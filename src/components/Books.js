import {
    fetchBookInfo, fetchAssociatedGames, fetchAssociatedMovies, fetchAssociatedMusicals,
    fetchAssociatedTVShow, fetchAssociatedArts, fetchAssociatedMusics, fetchListInSeries,
    fetchBookNeighbor, fetchSameGenreBooks, fetchBookAssociatedToAuthor
} from '../services/sparqlRequests'
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import './Books.css'
import {useNavigate, Link} from 'react-router-dom'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton"
import ArrowBackRounded from "@bit/mui-org.material-ui-icons.arrow-back-rounded";
import * as React from "react";
import Game from "./Game";
import Movie from "./Movie";
import BookResult from "./BookResult";
import {CircularProgress} from "@mui/material";

const Books = () => {

    let {bookURI} = useParams();
    let navigate = useNavigate();
    const [bookInfo, setBookInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    const [associatedGames, setAssociatedGames] = useState(null);
    const [associatedMovies, setAssociatedMovies] = useState(null);
    const [associatedMusicals, setAssociatedMusicals] = useState(null);
    const [associatedTVShows, setAssociatedTVShows] = useState(null);
    const [associatedArts, setAssociatedArts] = useState(null);
    const [associatedMusics, setAssociatedMusics] = useState(null);

    const [seriesOfBook, setSeriesOfBook] = useState(null);
    const [neighbors, setNeighbors] = useState(null);
    const [sameGenreBooks, setSameGenreBooks] = useState([]);
    const [sameAuthorBooks, setSameAuthorBooks] = useState([]);

    useEffect(() => {

        const loadBookInfo = async () => {
            setIsLoading(true);
            const response = await fetchBookInfo(bookURI);
            if (response.length === 0) {
                setError(true);
            }
            const content = response[0]
            console.log(content);

            const bookData = {
                name: content.name?.value,
                abstract: content.abstract?.value,
                authorURI: content.authorURI?.value.split("http://dbpedia.org/resource/")[1],
                authorName: content.authorName?.value,
                publishersURI: content.publishersURI?.value.split(","),
                publishers: content.publishers?.value.split(","),
                releaseDates: content.releaseDates?.value.split(","),
                genres: content.genres.value?.split(","),
                imageURL: content.imageURL?.value,
            }
            console.log(bookData);
            setIsLoading(false);
            setBookInfo(bookData)

        }

        loadBookInfo();
    }, [bookURI]);

    useEffect(() => {


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

        const loadSameGenreBooks = async () => {
            setIsLoading(true);
            const response = await fetchSameGenreBooks(bookURI);
            console.log(response);
            setSameGenreBooks(response);
            setIsLoading(false);
        }

        (async () => {
            await loadAssociatedSeriesOfBook();
            await loadBookNeighbors();
            await loadSameGenreBooks();

        })();
    }, [bookURI])

    useEffect(() => {

        const loadAssociatedWork = async () => {
            setIsLoading(true);
            const responseBook = await fetchBookAssociatedToAuthor(bookInfo.authorURI);
            const authorBooks = responseBook.filter((book) => {
                return (book.name.value !== bookInfo.name)
            })
            console.log(authorBooks);
            setSameAuthorBooks(authorBooks);
            const games = await fetchAssociatedGames(bookInfo.name, bookInfo.authorName);
            setAssociatedGames(games);
            const movies = await fetchAssociatedMovies(bookInfo.name, bookInfo.authorName);
            setAssociatedMovies(movies);
            const musicals = await fetchAssociatedMusicals(bookInfo.name, bookInfo.authorName);
            setAssociatedMusicals(musicals);
            const tvShows = await fetchAssociatedTVShow(bookInfo.name, bookInfo.authorName);
            setAssociatedTVShows(tvShows);
            const arts = await fetchAssociatedArts(bookInfo.name, bookInfo.authorName);
            setAssociatedArts(arts);
            const musics = await fetchAssociatedMusics(bookInfo.name, bookInfo.authorName);
            setAssociatedMusics(musics);
            setIsLoading(false);
        }

        if (bookInfo !== null && bookInfo.authorName !== undefined && bookInfo.authorURI !== undefined) {
            console.log(bookInfo);
            loadAssociatedWork();
        }

    }, [bookInfo])
    // useEffect(() => {
    //     // console.log("Book infos : ")
    //     // console.log(bookInfo);
    //     // console.log(associatedGames);
    //     // console.log(associatedMovies);
    //     // console.log(associatedMusicals);
    //     // console.log(associatedTVShows);
    //     // console.log(associatedArts);
    //     // console.log(associatedMusics);
    //     // console.log(seriesOfBook);
    //     // console.log(neighbors);
    //     setIsLoading(false)
    // }, [bookInfo, associatedGames, associatedMovies,
    //     associatedMusicals, associatedTVShows, associatedArts,
    //     associatedMusics, seriesOfBook, neighbors, sameGenreBooks])

    const render = () => {
        return (
            <div>
                {error && <Box display={"flex"} alignItems={"center"} justifyContent={"center"} height={"100vh"}>
                    <Typography fontWeight={"bold"} fontSize={"30px"}>
                        Resource not available
                    </Typography>
                </Box>}
                {!error && bookInfo === null &&
                <Box
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    height={"100vh"}
                >
                    <CircularProgress/>
                </Box>}
                {!error && bookInfo !== null &&
                <div className={"bookContainer"}>
                    <div className={"historyBack"}>
                        <IconButton onClick={() => navigate(-1, {state: setIsLoading(true)})} aria-label="delete"
                                    size="large">
                            <ArrowBackRounded fontSize="inherit"/>
                        </IconButton>
                    </div>
                    <div className={"titleWrapper"}>
                        <h1 className={"bookTitle"}>
                            {bookInfo.name}
                        </h1>
                        <div className={"authorWrapper"}>
                            <span className={"author"}>{bookInfo.authorName ?
                                <Link
                                    to={`../../authorInfo/${bookInfo.authorURI}`}> {bookInfo.authorName}</Link>
                                : bookInfo.authorURI}</span>
                        </div>
                        <div className={"mainContent"}>
                            <div className={"abstractWrapper"}>
                                <h2>Abstract</h2>
                                {bookInfo.abstract}
                            </div>
                            <div className={"imageWrapper"}>
                                {bookInfo.imageURL ?
                                    <img src={bookInfo.imageURL}/> :
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
                                            {bookInfo.name}
                                        </Typography>
                                        <Typography variant="body2" color="#DBDBDB">
                                            {bookInfo.authorName}
                                        </Typography>
                                    </Box>}
                            </div>
                        </div>
                        <div style={{'margin-bottom': '10px'}}>
                            <h2>Info</h2>
                            <div className={"infoWrapper"}>
                                {bookInfo.publishers[0] !== "" ?
                                    <>
                                        <div className={"publishersWrapper"}>
                                            Publishers
                                        </div>
                                        <div className={"publishersWrapper"}>
                                           <span> {bookInfo.publishers.map((publisher, index) => {
                                               return (
                                                   <span>
                                                       <Link
                                                           to={`../../editorInfo/${bookInfo.publishersURI[index].split("http://dbpedia.org/resource/")[1]}`}>
                                                           {publisher}
                                                       </Link>
                                                       {index !== bookInfo.publishers.length - 1 && <span>,</span>}
                                                    </span>
                                               )
                                           })

                                           }</span>
                                        </div>
                                    </>
                                    : null}
                                {bookInfo.releaseDates[0] !== "" ?
                                    <>
                                        <div className={"releaseDateWrapper"}>
                                            <span>Release Date</span>
                                        </div>
                                        <div className={"releaseDateWrapper"}>
                                            <span> {bookInfo.releaseDates.map((date, index) => {
                                                return (
                                                    <span>
                                                        {date}
                                                        {index !== bookInfo.releaseDates.length - 1 && <span>,</span>}
                                                    </span>
                                                )
                                            })

                                            }</span>
                                        </div>
                                    </> : null}
                                {bookInfo.titleOrig ?
                                    <>
                                        <div className={"titleOrig"}>
                                            <span>Original Title</span>
                                        </div>
                                        <div className={"titleOrig"}>
                                            <span> {bookInfo.titleOrig}</span>
                                        </div>
                                    </> : null}

                                {bookInfo.genres[0] !== "" ?
                                    <>
                                        {console.log(bookInfo.genres)}
                                        <div className={"literaryGenres"}>
                                            <span>Literary genre </span>
                                        </div>
                                        <div className={"literaryGenres"}>
                                            <span> {bookInfo.genres.map((genre, index) => {
                                                return (
                                                    <span>
                                                        {genre}
                                                        {index !== bookInfo.genres.length - 1 && <span>,</span>}
                                                    </span>
                                                )
                                            })

                                            }</span>
                                        </div>
                                    </> : null}
                            </div>
                        </div>
                        <div>
                            {sameAuthorBooks.length !== 0 &&
                            <>
                                <div className={"relatedWrapper"}>
                                    <h3>From the same author</h3>
                                    <div className={"otherBooksWrapper"}>
                                        {sameAuthorBooks.map((obj, index) => {
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
                            </>
                            }
                            {sameGenreBooks.length !== 0 &&
                            <div className={"relatedWrapper"}>
                                <h3>From the same genre</h3>
                                <div className={"otherBooksWrapper"}>
                                    {sameGenreBooks.map((obj, index) => {
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
                            </div>}
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

export default Books;