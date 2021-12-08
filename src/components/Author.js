import React from "react";
//import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import {
  queryAuthor,
  queryAuthorAdvancedInfo,
  fetchBookAssiociatedToAuthor,
} from "../services/sparqlRequests";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./Books.css";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ArrowBackRounded from "@bit/mui-org.material-ui-icons.arrow-back-rounded";
import Lottie from "react-lottie";
import BookResult from "./BookResult";
import { fetchBookInfo } from "../services/sparqlRequests";
import animationData from "../lotties/book-loading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Author(data) {
  const navigate = useNavigate();
  const { authorURI } = useParams();
  const [authorInfo, setAuthorInfo] = useState(null);
  const [advancedInfo, setAdvancedInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listAwards, setListAwards] = useState(null);
  const [listGenres, setListGenres] = useState(null);
  const [listOccupation, setListOccupation] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const loadAuthorInfo = async () => {
      setIsLoading(true);
      const response = await queryAuthor(authorURI);
      setAuthorInfo(response[0]);
      setIsLoading(false);

      // initialise arrays
      setListAwards(splitString(response[0].listAwards.value));

      if (response[0].listGenres !== null) {
        setListGenres(response[0].listGenres?.value.split(","));
      }
    };
    loadAuthorInfo();
  }, [authorURI]);

  useEffect(() => {
    const loadBookInfo = async () => {
      setIsLoading(true);
      const responseBook = await fetchBookAssiociatedToAuthor(authorURI);
      setIsLoading(false);
      setBooks(responseBook);
    };
    loadBookInfo();
  }, [authorURI]);

  useEffect(() => {
    const loadAdvancedInfo = async () => {
      setIsLoading(true);
      const responseAdvanced = await queryAuthorAdvancedInfo(authorURI);
      console.log("response = "+ JSON.stringify(responseAdvanced));
      setIsLoading(false);
      if (responseAdvanced[0].occupation !== null) {
        setListOccupation(responseAdvanced[0].occupation?.value.split(","));
      }
      setAdvancedInfo(responseAdvanced[0]);
    };
    loadAdvancedInfo();
  }, [authorURI]);

  let splitString = (string) => {
    if (string !== null) {
      return string.split(";");
    }
  };

  const render = () => {
    return (
      <div>
        {authorInfo === null && <div>Loading results</div>}
        {authorInfo !== null && advancedInfo !== null && books !== null && (
          <div className={"bookContainer"}>
            <div className={"historyBack"}>
              <IconButton
                onClick={() => navigate(-1)}
                aria-label="delete"
                size="large"
              >
                <ArrowBackRounded fontSize="inherit" />
              </IconButton>
            </div>
            <div className={"titleWrapper"}>
              <Typography component="h1" variant="h1">
                {authorInfo.name?.value}
              </Typography>

              {authorInfo.birthDate ? (
                <h3> {authorInfo.birthDate.value} </h3>
              ) : (
                <h3>Pas d'informations</h3>
              )}
              {authorInfo.deathDate ? (
                <h3> {authorInfo.deathDate.value} </h3>
              ) : (
                <h3>Présent</h3>
              )}

              <div className={"mainContent"}>
                <div className={"abstractWrapper"}>
                  <Typography component="h2" variant="h2">
                    Description
                  </Typography>
                  {authorInfo.description?.value}
                </div>
                <div className={"imageWrapper"}>
                  <img src={authorInfo.image?.value} />
                </div>
              </div>
              <div>
                <h2>Info</h2>
                <div className={"infoWrapper"}>
                  <div>
                    {advancedInfo.nationality !== null && (
                      <div>
                        <Typography component="h6" variant="h6">
                          Nationality
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    {advancedInfo.nationality !== null && (
                      <div>{advancedInfo.nationality?.value}</div>
                    )}
                  </div>

                  <div>
                    {advancedInfo.movement !== null && (
                      <div>
                        <Typography component="h6" variant="h6">
                          Movement
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    {advancedInfo.movement !== null && (
                      <div>{advancedInfo.movement?.value}</div>
                    )}
                  </div>
                        
                  <div><Typography component="h6" variant="h6">Awards</Typography></div>
                  <div>
                    <ul>
                      {listAwards !== null &&
                        listAwards.map((award) => <li key={award}>{award}</li>)}
                    </ul>
                  </div>

                  <div>
                    {authorInfo.occupation?.value !== null && (
                      <Typography component="h6" variant="h6">
                        Occupation
                      </Typography>
                    )}
                  </div>

                  <div>
                    <ul>
                      {listOccupation !== null &&
                        listOccupation.map((award) => (
                          <li key={award}>{award}</li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    {authorInfo.education !== null && (
                      <div>
                        <Typography component="h6" variant="h6">
                          Education
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div>
                    {authorInfo.education !== null && (
                      <div>{authorInfo.education?.value}</div>
                    )}
                  </div>
                  <div>
                    <Typography component="h6" variant="h6">
                      Genres
                    </Typography>
                  </div>
                  <div>
                    <ul>
                      {listGenres !== null &&
                        listGenres?.map((genre) => (
                          <li key={genre}>{genre}</li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <Typography component="h2" variant="h2" sx={{ mb: 3 }}>
                    Books by this author
                  </Typography>
                </div>

                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                >
                  {books?.map((obj, index) => {
                    console.log(obj);
                    let term = obj;
                    console.log(term.imageUrl?.value);
                    const data = {
                      title: term.name?.value,
                      author: authorInfo.name?.value,
                      img: term.imageUrl?.value,
                      releaseDate: term.releaseDate?.value,
                      bookURI: term.book?.value.split(
                        "http://dbpedia.org/resource/"
                      )[1],
                    };
                    return BookResult(index, data, navigate);
                  })}
                </Grid>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  return <div>{render()}</div>;
}

export default Author;