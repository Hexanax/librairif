import React from "react";
//import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import {
  queryAuthor,
  queryAuthorAdvancedInfo,
  fetchBookAssiociatedToAuthor,
  getAuthorTimeLife,
  getAuthorInspiration,
  getRelatedAuthor,
  getFamilyTree,
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
import TimelineElement from "./Timeline"
import AuthorResult from "./AuthorResult";
import FamilyTree from "./FamilyTree";

import { fetchBookInfo } from "../services/sparqlRequests";
import animationData from "../lotties/book-loading.json";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";


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
  const [relatedAuthor, setRelatedAuthor] = useState(null);
  const [family, setFamily] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listAwards, setListAwards] = useState(null);
  const [listGenres, setListGenres] = useState(null);
  const [listOccupation, setListOccupation] = useState(null);
  const [authorTimeline, setAuthorTimeline] = useState(null);
  const [listInterest, setListInterest] = useState(null);
  const [listNotableIdea, setListNotableIdea] = useState(null);
  const [listPhilosophicalSchool, setListPhilosophicalSchool] = useState(null);
  const [listAcademicDiscipline, setListAcademicDiscipline] = useState(null);
  const [books, setBooks] = useState([]);

  const resetState = () => {
    setAuthorInfo(null);
    setAdvancedInfo(null);
    setRelatedAuthor(null);
    setFamily(null);
    setListAwards(null);
    setListGenres(null);
    setListOccupation(null);
    setListInterest(null);
    setListNotableIdea(null);
    setListPhilosophicalSchool(null);
    setListAcademicDiscipline(null);
    setAuthorTimeline(null);
    setBooks([])
  }


  useEffect(() => {
    const loadAuthorInfo = async () => {
      setIsLoading(true);
      const response = await queryAuthor(authorURI);
      setAuthorInfo(response[0]);
      setIsLoading(false);

      // initialise arrays
      if (
        response[0].listAwards !== null &&
        response[0].listAwards?.value !== ""
      ) {
        setListAwards(response[0].listAwards?.value.split(";"));
      }

      if (
        response[0].listGenres !== null &&
        response[0].listGenres?.value !== ""
      ) {
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
      const authorInspiredBy = await getAuthorInspiration(authorURI, true);
      const authorInfluenced = await getAuthorInspiration(authorURI, false);
      responseAdvanced[0].authorInspiredBy = authorInspiredBy;
      responseAdvanced[0].authorInfluenced = authorInfluenced;

      setIsLoading(false);
      if (
        responseAdvanced[0].occupation !== null &&
        responseAdvanced[0].occupation?.value !== ""
      ) {
        setListOccupation(responseAdvanced[0].occupation?.value.split(","));
      }
      if (
        responseAdvanced[0].mainInterest !== null &&
        responseAdvanced[0].mainInterest?.value !== ""
      ) {
        setListInterest(responseAdvanced[0].mainInterest?.value.split(","));
      }
      if (
        responseAdvanced[0].notableIdea !== null &&
        responseAdvanced[0].notableIdea?.value !== ""
      ) {
        setListNotableIdea(responseAdvanced[0].notableIdea?.value.split(","));
      }
      if (
        responseAdvanced[0].philosophicalSchool !== null &&
        responseAdvanced[0].philosophicalSchool?.value !== ""
      ) {
        setListPhilosophicalSchool(
          responseAdvanced[0].philosophicalSchool?.value.split(",")
        );
      }
      if (
        responseAdvanced[0].academicDiscipline !== null &&
        responseAdvanced[0].academicDiscipline?.value !== ""
      ) {
        setListAcademicDiscipline(
          responseAdvanced[0].academicDiscipline?.value.split(",")
        );
      }
      setAdvancedInfo(responseAdvanced[0]);
    };
    loadAdvancedInfo();
  }, [authorURI]);


  useEffect(() => {
    const loadTimeline = async () => {
      setIsLoading(true);
      const timeline = await getAuthorTimeLife(authorURI);
      console.log("author timeline" + JSON.stringify(timeline));
      let works, dates;
      if (timeline[0].notableWorkName !== null) {
        works = timeline[0].notableWorkName?.value.split(";");
      }
      if (timeline[0].releaseDate !== null) {
        dates = timeline[0].releaseDate?.value.split(";");
      }
      let i = -1;
      const notableWork = [];

      if (authorInfo !== null) {
        if (authorInfo.birthDate !== null) {
          if (authorInfo.birthDate?.value != null) {
            notableWork.push({
              "work": "Birth Date",
              "date": authorInfo.birthDate?.value,
              "type": "birth"
            });
          }
        }
        while (works[++i]) {
          notableWork.push({
            "work": works[i],
            "date": dates[i],
            "type": "work"
          });
        }
        if (authorInfo !== null) {
          if (authorInfo.deathDate !== null) {
            if (authorInfo.deathDate?.value != null) {
              notableWork.push({
                "work": "Death Date",
                "date": authorInfo.deathDate?.value,
                "type": "death"
              })
            }
          }
        }

      }

      setAuthorTimeline(notableWork);
      setIsLoading(false);
    };
    loadTimeline();
  }, [authorInfo, authorURI]);
  useEffect(() => {
    const loadRelatedAuthors = async () => {
      if (authorInfo !== null && advancedInfo !== null) {
        let query = "";
        if (
          listPhilosophicalSchool !== null &&
          listPhilosophicalSchool.length !== 0
        ) {
          query = `?writer dbo:philosophicalSchool ?filtre.
          ?filtre rdfs:label "${listPhilosophicalSchool[0]}"@en.`;
        } else if (
          listAcademicDiscipline !== null &&
          listAcademicDiscipline !== null
        ) {
          query = `?writer dbo:academicDiscipline ?filtre.
          ?filtre rdfs:label "${listAcademicDiscipline[0]}"@en.`;
        } else if (advancedInfo.movement !== null) {
          query = `?writer dbo:movement ?filtre.
          ?filtre rdfs:label "${advancedInfo.movement}"@en.`;
        } else if (listGenres !== null && listGenres !== null) {
          query = `?writer dbo:genre ?filtre.
          ?filtre rdfs:label "${listGenres[0]}"@en.`;
        }
        if (query !== "") {
          const relatedAuthor = await getRelatedAuthor(authorURI, query);
          setRelatedAuthor(relatedAuthor);
        } else {
          setRelatedAuthor([]);
        }
      }
    };
    loadRelatedAuthors();
  }, [authorURI, authorInfo, advancedInfo]);

  useEffect(() => {
    const loadFamilyTree = async () => {
      setIsLoading(true);
      const response = await getFamilyTree(authorURI);
      setFamily(response);
      setIsLoading(false);
    };
    loadFamilyTree();
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
        {authorInfo !== null &&
          advancedInfo !== null &&
          books !== null &&
          relatedAuthor != null &&
          authorTimeline != null && (
            <div className={"bookContainer"}>
              <div className={"historyBack"}>
                <IconButton
                  onClick={() => {
                    resetState();
                    navigate(-1);
                  }}
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
                  <h3>No informations</h3>
                )}
                {authorInfo.deathDate ? (
                  <h3> {authorInfo.deathDate.value} </h3>
                ) : (
                  null
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
              </div>

              <div>
                {authorTimeline.length !==0 ?
                  <div className="timelineWrapper">
                    <br/>
                    <div>
                      <Typography component="h6" variant="h6">
                        Timeline
                      </Typography>
                    </div>

                    <div>
                      <div><TimelineElement key={authorTimeline} data={authorTimeline} /></div>
                    </div>
                  </div> : null}
              </div>



              <div>
                <h2>Info</h2>
                <div className={"infoWrapper"}>
                  {advancedInfo.nationality?.value !== "" ? (
                    <>
                      <div>
                        <div>
                          <Typography component="h6" variant="h6">
                            Nationality
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <div>{advancedInfo.nationality?.value}</div>
                      </div>
                    </>
                  ) : null}
                  {advancedInfo.movement ? (
                    <>
                      <div>
                        <div>
                          <Typography component="h6" variant="h6">
                            Movement
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <div>{advancedInfo.movement?.value}</div>
                      </div>
                    </>
                  ) : null}
                  {listAwards ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Awards
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listAwards.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}
                  {listOccupation ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Occupation
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listOccupation.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}
                  {authorInfo.education?.value !== "" ? (
                    <>
                      <div>
                        <div>
                          <Typography component="h6" variant="h6">
                            Education
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <div>{authorInfo.education?.value}</div>
                      </div>
                    </>
                  ) : null}
                  {listGenres ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Genres
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listGenres?.map((genre) => (
                            <li key={genre}>{genre}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}{" "}
                  {listInterest ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Main Interest
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listInterest.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}{" "}
                  {listNotableIdea ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Notable Idea
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listNotableIdea.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}{" "}
                  {listPhilosophicalSchool ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Philosophical School
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listPhilosophicalSchool.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}{" "}
                  {listAcademicDiscipline ? (
                    <>
                      <div>
                        <Typography component="h6" variant="h6">
                          Academic Discipline
                        </Typography>
                      </div>
                      <div>
                        <ul>
                          {listAcademicDiscipline.map((award) => (
                            <li key={award}>{award}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : null}
                </div>
                {books.length !== 0 ? (
                  <>
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
                        let term = obj;
                        const data = {
                          title: term.name?.value,
                          author: authorInfo.name?.value,
                          img: term.imageUrl?.value,
                          releaseDate: term.releaseDate?.value,
                          bookURI: term.book?.value.split(
                            "http://dbpedia.org/resource/"
                          )[1],
                        };
                        return <BookResult key={index} index={index} data={data} navigate={navigate} />
                      })}
                    </Grid>
                  </>
                ) : null}
                {advancedInfo.authorInfluenced?.length !== 0 ? (
                  <>
                    <div>
                      <Typography component="h2" variant="h2" sx={{ mb: 3 }}>
                        Writer influenced this author
                      </Typography>
                    </div>
                    <Grid
                      container
                      spacing={2}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      {advancedInfo.authorInfluenced?.map((obj, index) => {
                        let term = obj;
                        const data = {
                          name: term.name?.value,
                          img: term.imageUrl?.value,
                          birthDate: term.birthDate?.value,
                          deathDate: term.deathDate?.value,
                          authorURI: term.writer?.value.split(
                            "http://dbpedia.org/resource/"
                          )[1],
                        };
                        return AuthorResult(index, data, navigate, resetState);
                      })}
                    </Grid>
                  </>
                ) : null}{" "}
                {advancedInfo.authorInspiredBy?.length !== 0 ? (
                  <>
                    <div>
                      <Typography component="h2" variant="h2" sx={{ mb: 3 }}>
                        Writer influenced by this author
                      </Typography>
                    </div>
                    <Grid
                      container
                      spacing={2}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      {advancedInfo.authorInspiredBy?.map((obj, index) => {
                        let term = obj;
                        const data = {
                          name: term.name?.value,
                          img: term.imageUrl?.value,
                          birthDate: term.birthDate?.value,
                          deathDate: term.deathDate?.value,
                          authorURI: term.writer?.value.split(
                            "http://dbpedia.org/resource/"
                          )[1],
                        };
                        return AuthorResult(index, data, navigate, resetState);
                      })}
                    </Grid>
                  </>
                ) : null}{" "}
                {relatedAuthor.length !== 0 ? (
                  <>
                    <div>
                      <Typography component="h2" variant="h2" sx={{ mb: 3 }}>
                        Authors related
                      </Typography>
                    </div>
                    <Grid
                      container
                      spacing={2}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                    >
                      {relatedAuthor?.map((obj, index) => {
                        let term = obj;
                        const data = {
                          name: term.name?.value,
                          img: term.imageUrl?.value,
                          birthDate: term.birthDate?.value,
                          deathDate: term.deathDate?.value,
                          authorURI: term.writer?.value.split(
                            "http://dbpedia.org/resource/"
                          )[1],
                        };
                        return AuthorResult(index, data, navigate, resetState);
                      })}
                    </Grid>
                  </>
                ) : null}
                <div>
                  <Typography component="h2" variant="h2" sx={{ mb: 3 }}>
                    Children Tree
                  </Typography>
                </div>
                <div>
                  {
                    <FamilyTree
                      family={family}
                      authorName={authorInfo.name?.value}
                    />
                  }
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
