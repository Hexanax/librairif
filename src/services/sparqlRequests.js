import { NearMe } from "@mui/icons-material";
import axios from "axios";

function encodeResource(resourceURI) {
  resourceURI = resourceURI.replace(/[(]/g, "\\(");
  resourceURI = resourceURI.replace(/[)]/g, "\\)");
  resourceURI = resourceURI.replace(/[']/g, "\\'");
  resourceURI = resourceURI.replace(/["]/g, `\\"`);

  return resourceURI;
}

export async function fetchBookInfo(resourceURI) {
  //TODO CHANGE HARDCODED URI
  resourceURI = encodeResource(resourceURI);

  //console.log(resourceURI);
  const book = `dbr:${resourceURI}`;
  const content = `SELECT ?name ?titleOrig ?imageURL ?abstract ?authorURI ?authorName
    (GROUP_CONCAT(DISTINCT ?publisherURI;   SEPARATOR=", ") AS ?publishersURI)
    (GROUP_CONCAT(DISTINCT ?publisher;   SEPARATOR=", ") AS ?publishers)
    (GROUP_CONCAT(DISTINCT ?releaseDate;   SEPARATOR=", ") AS ?releaseDates)
    (GROUP_CONCAT(DISTINCT ?genre;   SEPARATOR=", ") AS ?genres)
        WHERE {
            ${book} dbp:name ?name;
            dbo:abstract ?abstract.
            OPTIONAL{${book} dbp:titleOrig ?titleOrig.}
            OPTIONAL{${book} dbp:releaseDate ?releaseDate.}
            OPTIONAL{${book} dbo:thumbnail ?imageURL.}
            OPTIONAL{${book} dbo:literaryGenre ?genreURI.
            ?genreURI rdfs:label ?genre.
            FILTER(lang(?genre)="en")}
            OPTIONAL{${book} dbp:publisher ?publisherURI.
            ?publisherURI rdfs:label ?publisher.
            FILTER(lang(?publisher)="en")}
            OPTIONAL{${book} dbp:author ?authorURI.}
            OPTIONAL{?authorURI dbp:name ?authorName.}
            FILTER(lang(?abstract) = "en")
        }`;
  console.log(content);
  return await axiosQuery(content);
}

/**
 * Allows to get the list of book associated with the current on if
 * it is in a series of book Uri of the current book
 * @param {*} ressourceURI
 */
export async function fetchListInSeries(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const currentBook = `dbr:${resourceURI}`;
  let query = [
    `Select ?bookUri ?serie ?name ?imageURL WHERE {
        ${currentBook} dbo:series ?serie.
        ?bookUri a dbo:Book;
        dbp:name ?name;
        dbo:series ?serie.
        OPTIONAL{?bookUri dbo:thumbnail ?imageURL}
        }`,
  ].join("");
  return await axiosQuery(query);
}

export async function fetchSameGenreBooks(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const currentBook = `dbr:${resourceURI}`;
  let query = [
    `Select ?book ?genre ?name ?imageUrl
    (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?releaseDate) AS ?releaseDate)
        WHERE {
        ${currentBook} dbo:literaryGenre ?genre.
        ?book a dbo:Book;
        dbp:name ?name;
        dbp:author ?author;
        dbo:literaryGenre ?genre.
        ?author dbp:name ?authorName.
        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
        OPTIONAL{?book dbo:thumbnail ?imageUrl}
        OPTIONAL{?book dbp:author ?authorURI.}
        }`,
  ].join("");
  const response = await axiosQuery(query);
  const shuffled = response.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, 5);
  //console.log(selected);
  return selected;
}

/**
 * Returns from DBPedia the general information of an editor : their name, abstract, image, country
 * foundation year, their website and a list of their founders
 * These information are to be displayed on an editor's page 
 * @param {String} authorURI 
 * @returns the general information of an editor
 */
export async function fetchEditorInfo(editorName) {
  editorName = encodeResource(editorName);
  let editorRsrc = `dbr:${editorName}`;
  let query = `SELECT ?label ?abstract
    (GROUP_CONCAT(DISTINCT ?year;   SEPARATOR=", ") AS ?foundation)
    (GROUP_CONCAT(DISTINCT ?imageUrl;   SEPARATOR=", ") AS ?imageURL)
    (GROUP_CONCAT(DISTINCT ?founder;   SEPARATOR=", ") AS ?founders)
    (GROUP_CONCAT(DISTINCT ?homepage;    SEPARATOR=", ") AS ?homepages)
    (GROUP_CONCAT(DISTINCT ?country; SEPARATOR=", ") AS ?countries) WHERE {
      ${editorRsrc} rdfs:label ?label;
      dbo:abstract ?abstract.
      OPTIONAL{${editorRsrc} dbo:founder ?founder}
      OPTIONAL{${editorRsrc} dbo:thumbnail ?imageUrl.}
      OPTIONAL{${editorRsrc} dbo:foundingYear | dbp:founded ?year}
      OPTIONAL{${editorRsrc} foaf:homepage ?homepage}
      OPTIONAL{${editorRsrc} dbp:country /foaf:name | dbp:country | dbo:country /foaf:name   ?country}
      FILTER(lang(?abstract) = "en").
      FILTER(lang(?label) = "en").
    }`;
  
  return await axiosQuery(query);
}

/**
 * Fetches the list of maximum 5 books published by the current editor.
 * @param {*} ressourceURI
 */
export async function fetchEditorBooks(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const editor = `dbr:${resourceURI}`;
  let query = [
    `Select ?book ?genre ?name ?imageUrl
    (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?releaseDate) AS ?releaseDate)
        WHERE {
        ?book a dbo:Book;
        dbp:name ?name;
        dbp:author ?author;
        dbo:publisher ${editor}.
        ?author dbp:name ?authorName.
        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
        OPTIONAL{?book dbo:thumbnail ?imageUrl}
        OPTIONAL{?book dbp:author ?authorURI.}
        }`,
  ].join("");
  const response = await axiosQuery(query);
  const shuffled = response.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, 5);
  
  return selected;
}

export async function fetchRelatedEditors(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const editor = `dbr:${resourceURI}`;
  let query = [
    `Select ?publisher ?countryAns WHERE {
          ${editor} dbp:country | dbp:country / foaf:name | dbo:country / foaf:name ?countryReq.
          ?publisher a dbo:Publisher;
          dbp:country | dbp:country / foaf:name | dbo:country / foaf:name ?countryAns.
          FILTER(?countryAns = ?countryReq)
        }LIMIT 10`,
  ].join("");
  const response = await axiosQuery(query);
  console.log(response);
  const shuffled = response.sort(() => 0.5 - Math.random());
  let selected = shuffled.slice(0, 5);
  //console.log(selected);
  return selected;
}

/**
 * Allows to get the previous and the following book of the current one
 * @param {String} ressourceURI Uri of the current book
 * @returns ?book => the uri of the book; ?name => the name in english; ?position => before or after
 */
export async function fetchBookNeighbor(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const currentBook = `dbr:${resourceURI}`;
  let query = [
    `Select ?book ?name ?position WHERE {
        {{ 
        ${currentBook} dbp:precededBy ?book.
        ?book a dbo:Book.
        ?book rdfs:label ?name.
        BIND('before' AS ?position) 
        } UNION {
        ${currentBook} dbp:followedBy ?book.
        ?book a dbo:Book.
        ?book rdfs:label ?name.
        BIND('after' AS ?position)
        }}
        FILTER(lang(?name) = "en") } ORDER BY DESC(?position)`,
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of games based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedGames(name, author) {
  name = encodeResource(name);
  author = encodeResource(author);
  let query = [
    `SELECT DISTINCT(STR(?label)) as ?game ?uri ?date ?developer ?developerName
    WHERE{
        ?uri rdf:type dbo:VideoGame; 
        dbo:abstract ?abstract;
        dbo:releaseDate ?date;
        dbo:developer ?developer;
        rdfs:label ?label.
        ?developer rdfs:label ?developerName
        Filter(( lang(?label)="en" and lang(?abstract)="en" and lang(?developerName)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))}
    GROUP BY ?game ?uri ?date ORDER BY ASC(?date) ASC(?game)`,
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of movies based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedMovies(name, author) {
  name = encodeResource(name);
  author = encodeResource(author);
  let query = [
    `SELECT DISTINCT(STR(?label)) as ?movie ?uri ?runtime ?thumbnail
    (GROUP_CONCAT(DISTINCT ?producer; SEPARATOR=", ") AS ?producers)
    (GROUP_CONCAT(DISTINCT ?producerName; SEPARATOR=", ") AS ?producersName)
    WHERE{
      ?uri rdf:type dbo:Film;
      dbo:abstract ?abstract;
      dbo:producer ?producer;
      dbo:runtime ?runtime;
      rdfs:label ?label.
      ?producer rdfs:label ?producerName
      OPTIONAL{?uri dbo:thumbnail ?thumbnail}
      Filter(( lang(?label)="en" and lang(?abstract)="en" and lang(?producerName)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
    }`,
  ].join("");
  //console.log(query);
  return await axiosQuery(query);
}

/**
 * Allows to get the list of musicals based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedMusicals(name, author) {
  name = encodeResource(name);
  author = encodeResource(author);
  let query = [
    `SELECT DISTINCT(STR(?label)) as ?musical ?uri ?author ?authorName ?lyric ?lyricistName ?music ?composerName
         WHERE{
            ?uri rdf:type dbo:Musical;
            dbo:abstract ?abstract;
            dbo:author ?author;
            dbo:lyrics ?lyric; 
            dbo:musicBy ?music;
            rdfs:label ?label.
            ?author rdfs:label ?authorName.
            ?music rdfs:label ?composerName.
            ?lyric rdfs:label ?lyricistName.
            Filter(( lang(?label)="en" and lang(?abstract)="en" and lang(?authorName)="en" and lang(?lyricistName)="en" and lang(?composerName)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
        }
        GROUP BY ?musical ?uri ORDER BY ASC(?musical)`,
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of series based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedTVShow(name, author) {
  name = encodeResource(name);
  author = encodeResource(author);
  let query = [
    `SELECT DISTINCT(STR(?label)) as ?serie ?uri ?writer ?authorName ?composer ?composerName ?season
         WHERE{
            ?uri rdf:type dbo:TelevisionShow;
            dbo:abstract ?abstract;
            dbo:composer ?composer;
            dbo:numberOfSeasons ?season;
            rdfs:label ?label.
            ?composer rdfs:label ?composerName.
            OPTIONAL{?uri dbp:writer ?writer.}
            Filter(( lang(?label)="en" and lang(?abstract)="en" and lang(?composerName)="en" and lang(?writer)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
        }
        ORDER BY ASC(?serie)`,
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of musics based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedMusics(name, author) {
  name = encodeResource(name);
  author = encodeResource(author);
  let query = [
    `SELECT DISTINCT ?uri  (STR(?label)) as  ?music ?artist ?artistName
    WHERE{
       {
         ?uri a dbo:Song .
       } UNION {
         ?uri a dbo:Single.    
       } UNION {
         ?uri a dbo:Sound.
       }
       ?uri dbo:abstract ?abstract;
       dbo:artist ?artist;
       rdfs:label ?label.
       ?artist rdfs:label ?artistName
       Filter(( lang(?label)="en" and lang(?abstract)="en" and lang(?artistName)="en" ) and (regex(?abstract,"${name}","i")) )
      }`,
  ].join("");
  return await axiosQuery(query);
}


/**
 * Returns from DBPedia the general information of an author : his name, description, image,
 * birth and death dates, and a list of his genres and awards
 * These information are to be displayed on an author's page 
 * @param {String} authorURI 
 * @returns the general information of an author
 */
export async function queryAuthor(authorURI) {
  authorURI = encodeResource(authorURI);
  let author = `dbr:${authorURI}`;
  let query = `SELECT (MIN(?name) AS ?name) ?description ?birthDate ?deathDate ?image 
    GROUP_CONCAT(DISTINCT ?education, ", ") as ?education
    GROUP_CONCAT(DISTINCT ?listGenres, ",") as ?listGenres
    GROUP_CONCAT(DISTINCT ?listAwards, ";") as ?listAwards 
  WHERE {
  ${author} dbp:name ?name.
  ${author} dbo:abstract ?description.
  OPTIONAL{${author} dbo:birthDate ?birthDate}
  OPTIONAL{${author} dbo:deathDate ?deathDate}
  OPTIONAL{${author} dbo:thumbnail ?image}
  OPTIONAL {
    {{
    	${author} dbo:education / rdfs:label | dbp:education / rdfs:label | dbp:education ?education
    }}
    FILTER(?education != ""@en)
    FILTER(lang(?education) = "en")
  }
  OPTIONAL{${author} dbp:awards ?awards. ?awards rdfs:label ?listAwards.
    FILTER(?listAwards != ""@en)
    FILTER(lang(?listAwards) = "en")
  }
  OPTIONAL {
    {{
    	${author} dbo:genre / rdfs:label | dbp:genre / rdfs:label |  dbp:genre ?listGenres
    	
    }}
    FILTER(?listGenres != ""@en)
    FILTER(lang(?listGenres) = "en")
  }
  FILTER(?name != ""@en)
  FILTER(lang(?description) = "en")
  FILTER(lang(?listAwards) = "en")
  }`;
  //console.log("query" + query);
  return await axiosQuery(query);
}

/**
 * Allows to try to get on DBpedia the advanced information of an author
 * that the user wants to know more about
 * @param {String} authorURI URI that allows to identify the resource in DBpedia
 * @returns Advanced information available
 */
export async function queryAuthorAdvancedInfo(authorURI) {
  authorURI = encodeResource(authorURI);
  let author = `dbr:${authorURI}`;
  let query = `SELECT ?name
    GROUP_CONCAT(DISTINCT ?occupation, ",") as ?occupation
    GROUP_CONCAT(DISTINCT ?nationality, ", ") as ?nationality
    GROUP_CONCAT(DISTINCT ?mainInterest, ",") as ?mainInterest
    GROUP_CONCAT(DISTINCT ?notableIdea, ",") as ?notableIdea
    GROUP_CONCAT(DISTINCT ?philosophicalSchool, ",") as ?philosophicalSchool
    GROUP_CONCAT(DISTINCT ?academicDiscipline, ",") as ?academicDiscipline
    ?movement
  WHERE {
    ${author} dbp:name ?name.
    OPTIONAL{${author} dbo:mainInterest / rdfs:label ?mainInterest. FILTER(lang(?mainInterest) = "en")}
    OPTIONAL{${author} dbo:notableIdea / rdfs:label ?notableIdea. FILTER(lang(?notableIdea) = "en")}
    OPTIONAL{${author} dbo:philosophicalSchool / rdfs:label ?philosophicalSchool. FILTER(lang(?philosophicalSchool) = "en")}
    OPTIONAL{${author} dbo:academicDiscipline / rdfs:label ?academicDiscipline. FILTER(lang(?academicDiscipline) = "en")}
    OPTIONAL {
        {{
            ${author} dbo:occupation / rdfs:label | dbo:occupation / rdfs:label | dbp:occupation  ?occupation.
            
        }}
        FILTER(?occupation != ""@en)
        FILTER(lang(?occupation) = "en")
      }
      OPTIONAL {
        {{
            ${author} dbo:nationality / rdfs:label | dbp:nationality / rdfs:label | dbo:nationality ?nationality.
        }}
        FILTER(?nationality != ""@en)
        FILTER(lang(?nationality) = "en")
      }
      OPTIONAL{
          ${author} dbo:movement / rdfs:label ?movement.
          FILTER(?movement != "")
          FILTER(lang(?movement) = "en")
        }
  }`;
  //console.log("query" + query);
  return await axiosQuery(query);
}

/**
 * Allows to get the list of books with resources in DBpedia written by the current author
 * @param {String} authorURI URI that allows to identify the resource in DBpedia
 * @returns list of books written by the author
 */
export async function fetchBookAssociatedToAuthor(authorURI) {
  authorURI = encodeResource(authorURI);
  let author = `dbr:${authorURI}`;
  let query = `SELECT ?book
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
    WHERE {
        ?book a dbo:Book;
          dbp:name ?name;
          dbo:author ${author};
          dbo:abstract ?abstract.
        OPTIONAL {?book dbo:thumbnail ?imageURL.}
        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
        FILTER(lang(?name) = "en")
        FILTER(lang(?abstract) = "en")
    } ORDER BY ASC(?name)
    `;
  console.log(query);
  let response = await axiosQuery(query);
  console.log(response);
  return response;
}


/**
 * Returns from DBPedia  the information needed for the author's timeline, i.e. his notable works like books and their release dates 
 * @param {String} resourceURI 
 * @returns list of notable works and their release dates 
 */
export async function getAuthorTimeLife(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const currentAuthor = `dbr:${resourceURI}`;
  let query = `SELECT GROUP_CONCAT(?notableWorkName, ";") as ?notableWorkName GROUP_CONCAT(?releaseDate, ";") as ?releaseDate WHERE {
        ${currentAuthor} dbo:notableWork ?notableWork.
        ?notableWork dbp:name ?notableWorkName;
        dbp:releaseDate ?releaseDate.
      }`;

  return await axiosQuery(query);
}

/**
 * Allows to get the list of author in DBpedia that have influenced the author or that have been
 * influenced by the current author
 * @param {String} resourceURI URI that allows to identify the resource in DBpedia
 * @param {Boolean} isInspiratedBy true if we want author inspirated by the current author
 * false if we want author that inspirated the current author
 * @returns the list of associated author depending on the boolean isInspiratedBy
 */
export async function getAuthorInspiration(resourceURI, isInspiratedBy) {
  resourceURI = encodeResource(resourceURI);
  const currentAuthor = `dbr:${resourceURI}`;
  let query = "";
  if (isInspiratedBy) {
    query = `SELECT DISTINCT ?writer 
    (MIN(?name) AS ?name) 
    (MAX(?image) AS ?imageUrl) 
    (MIN(?birthDate) AS ?birthDate) 
    (MIN(?deathDate) AS ?deathDate)
    WHERE {
        {{
          ?writer a dbo:Writer.
          } UNION {
            ?writer a dbo:Scientist.
          } UNION {
            ?writer a dbo:Philosopher.
          }
        }
        ?writer dbp:name ?name.
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        {{
            ?writer dbo:influencedBy | dbp:influences  ${currentAuthor}.
        
        }}
    } ORDER BY ASC(?name)  
    `;
  } else {
    query = `SELECT DISTINCT ?writer 
    (MIN(?name) AS ?name) 
    (MAX(?image) AS ?imageUrl) 
    (MIN(?birthDate) AS ?birthDate) 
    (MIN(?deathDate) AS ?deathDate)
    WHERE {
      {{
        ?writer a dbo:Writer.
        } UNION {
          ?writer a dbo:Scientist.
        } UNION {
          ?writer a dbo:Philosopher.
        }
      }
        ?writer dbp:name ?name.
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        {{
            ?writer dbo:influenced | dbp:influenced ${currentAuthor}.
        
        }}
    } ORDER BY ASC(?name)    
    `;
  }
  return await axiosQuery(query);
}

/**
 * Allows to get the list of authors in DBpedia associated with the current author
 * filter with parameter
 * @param {String} resourceURI URI that allows to identify the resource in DBpedia
 * @param {String} filtre the SPARQL filter used
 * @returns  the list of associated author depending on the filter
 */
export async function getRelatedAuthor(resourceURI, filtre) {
  resourceURI = encodeResource(resourceURI);
  const currentAuthor = `dbr:${resourceURI}`;
  let query = `SELECT DISTINCT ?writer ?filtre
  (MIN(?name) AS ?name) 
  (MAX(?image) AS ?imageUrl) 
  (MIN(?birthDate) AS ?birthDate) 
  (MIN(?deathDate) AS ?deathDate)
  WHERE {
      ?writer dbp:name ?name.
      {{
          ?writer a dbo:Writer.
        } UNION {
          ?writer a dbo:Scientist.
        } UNION {
          ?writer a dbo:Philosopher.
        }
      }
      OPTIONAL  {?writer dbo:thumbnail ?image.}
      OPTIONAL {?writer dbp:birthDate ?birthDate.}
      OPTIONAL {?writer dbp:deathDate ?deathDate.}
      ${filtre}
      FILTER(?writer != ${currentAuthor})
  } LIMIT 4`;
  return await axiosQuery(query);
}

/**
 * Allows to get the family tree with name of the current author
 * @param {String} resourceURI URI that allows to identify the resource in DBpedia
 * @returns the list of names of children of the author and name of his/her spouse
 */
export async function getFamilyTree(resourceURI) {
  resourceURI = encodeResource(resourceURI);
  const currentAuthor = `dbr:${resourceURI}`;
  let query = `SELECT ?spouse
  GROUP_CONCAT(DISTINCT ?children , ";") as ?children 
  WHERE {
      OPTIONAL {
      {{
          ${currentAuthor} dbo:spouse / rdfs:label | dbp:spouse / rdfs:label | dbp:spouse ?spouse.
      }}
      FILTER(?spouse != ""@en)
      FILTER(lang(?spouse) = "en")
    }
    OPTIONAL {
      ${currentAuthor} dbo:child / rdfs:label ?children
      FILTER(?children != ""@en)
      FILTER(lang(?children) = "en")
    }
  } LIMIT 1
  `;
  return await axiosQuery(query);
}

/**
 * Research books containing the correct name and author
 * @param {*} bookName
 * @param {*} author
 * @returns result array
 */
export async function researchQuery(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
  (MAX(?name) AS ?name)
  (MAX(?releaseDate) AS ?releaseDate)
  (MAX(?imageURL) AS ?imageUrl)
      WHERE {
          ?book a dbo:Book.
          ?book dbp:name ?name.
          ?book dbo:author ?author;
          dbo:abstract ?abstract.
          OPTIONAL {?book dbo:thumbnail ?imageURL.}
          OPTIONAL {?book dbp:releaseDate ?releaseDate.}
          ?author dbp:name ?authorName.
          FILTER(lang(?name) = "en")
          FILTER(lang(?abstract) = "en")
          FILTER (regex(?name, "${name}", "i") || regex(?authorName, "${name}","i"))
    } ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

async function getLiteraryGenre(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
        WHERE {
         	?book a dbo:Book.
	        ?book dbp:name ?name.
	        ?book dbo:author ?author;
	        dbo:abstract ?abstract.
	        OPTIONAL {?book dbo:thumbnail ?imageURL.}
	        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
	        ?author dbp:name ?authorName.
	        FILTER(lang(?name) = "en")
	        FILTER(lang(?abstract) = "en")
        {
            ?book dbo:literaryGenre / rdfs:label | dbp:genre ?literaryGenreLabel.
	    	FILTER(lang(?literaryGenreLabel) = "en")
	    	FILTER(regex(?literaryGenreLabel, "${name}", "i"))
     	}} ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

async function getGenre(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
        WHERE {
         	?book a dbo:Book.
	        ?book dbp:name ?name.
	        ?book dbo:author ?author;
	        dbo:abstract ?abstract.
	        OPTIONAL {?book dbo:thumbnail ?imageURL.}
	        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
	        ?author dbp:name ?authorName.
	        FILTER(lang(?name) = "en")
	        FILTER(lang(?abstract) = "en")
        {
               ?book dbp:genre ?genre.
	    	FILTER(lang(?genre) = "en")
	    	FILTER(regex(?genre, "${name}", "i"))
	   }
     	} ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

async function getCountry(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
        WHERE {
         	?book a dbo:Book.
	        ?book dbp:name ?name.
	        ?book dbo:author ?author;
	        dbo:abstract ?abstract.
	        OPTIONAL {?book dbo:thumbnail ?imageURL.}
	        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
	        ?author dbp:name ?authorName.
	        FILTER(lang(?name) = "en")
	        FILTER(lang(?abstract) = "en")
        {
               ?book dbp:country ?country;
	    	dbp:language ?language.
	    	FILTER(lang(?country) = "en")
	    	FILTER(lang(?language) = "en")
	    	FILTER (regex(?country, "${name}", "i") || regex(?language, "${name}","i"))
	   }
     	} ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

async function getSubject(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
        WHERE {
         	?book a dbo:Book.
	        ?book dbp:name ?name.
	        ?book dbo:author ?author;
	        dbo:abstract ?abstract.
	        OPTIONAL {?book dbo:thumbnail ?imageURL.}
	        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
	        ?author dbp:name ?authorName.
	        FILTER(lang(?name) = "en")
	        FILTER(lang(?abstract) = "en")
        {
               ?book dbp:subject ?subject.
	    	?subject rdfs:label ?subjectLabel.
	    	FILTER(lang(?subjectLabel) = "en")
	    	FILTER(regex(?subjectLabel, "${name}", "i"))
	   }
     	} ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

async function getHypernym(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?book (GROUP_CONCAT(DISTINCT ?authorName;   SEPARATOR=", ") AS ?authorNames)
    (MAX(?name) AS ?name)
    (MAX(?releaseDate) AS ?releaseDate)
    (MAX(?imageURL) AS ?imageUrl)
        WHERE {
         	?book a dbo:Book.
	        ?book dbp:name ?name.
	        ?book dbo:author ?author;
	        dbo:abstract ?abstract.
	        OPTIONAL {?book dbo:thumbnail ?imageURL.}
	        OPTIONAL {?book dbp:releaseDate ?releaseDate.}
	        ?author dbp:name ?authorName.
	        FILTER(lang(?name) = "en")
	        FILTER(lang(?abstract) = "en")
        {
            ?book gold:hypernym ?hypernym.
	    	?hypernym rdfs:label ?hypernymLabel.
	    	FILTER(lang(?hypernymLabel) = "en")
	    	FILTER(regex(?hypernymLabel, "${name}", "i"))
	   }
     	} ORDER BY ASC(?name) LIMIT ${limit}`;
  return await axiosQuery(query);
}

export async function getAuthors(name) {
  const offset = 0;
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
    ?writer a dbo:Writer.
    ?writer dbp:name ?name.
    OPTIONAL {?writer dbp:birthDate ?birthDate.}
    OPTIONAL {?writer dbp:deathDate ?deathDate.}
    OPTIONAL  {?writer dbo:thumbnail ?image.}
    FILTER (regex(?name, "${name}", "i"))
    } ORDER BY ASC(?name)`;
  return await axiosQuery(query);
}

async function getNationality(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
        ?writer a dbo:Writer.
        ?writer dbp:name ?name.
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        ?writer dbp:nationality ?nationality.
            FILTER(lang(?nationality) = "en")
            FILTER (regex(?nationality, "${name}", "i"))
    
        } ORDER BY ASC(?name) OFFSET ${limit}`;
  return await axiosQuery(query);
}

async function getOccupation(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
        ?writer a dbo:Writer.
        ?writer dbp:name ?name.
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        ?writer dbo:occupation ?occupation.
    	?occupation rdfs:label ?occupationLabel.
    	FILTER(lang(?occupationLabel) = "en")
    	FILTER (regex(?occupationLabel, "${name}", "i"))
    
        } ORDER BY ASC(?name) OFFSET ${limit}`;
  return await axiosQuery(query);
}
async function getAuthorSubject(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
        ?writer a dbo:Writer.
        ?writer dbp:name ?name.
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        OPTIONAL  {?writer dbo:thumbnail ?image.}
    	?writer dct:subject ?subject.
    	?subject rdfs:label ?subjectLabel.
    	FILTER(lang(?subjectLabel) = "en")
    	FILTER (regex(?subjectLabel, "${name}", "i"))
    
        } ORDER BY ASC(?name) OFFSET ${limit}`;
  return await axiosQuery(query);
}
async function getMovement(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
        ?writer a dbo:Writer.
        ?writer dbp:name ?name.
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        ?writer dbo:movement ?movement.
    	?movement rdfs:label ?movementLabel.
    	FILTER(lang(?movementLabel) = "en")
    	FILTER (regex(?movementLabel, "${name}", "i"))
    
        } ORDER BY ASC(?name) OFFSET ${limit}`;
  return await axiosQuery(query);
}
async function getAuthorGenre(name, limit) {
  name = encodeResource(name);
  let query = `SELECT ?writer (MIN(?name) AS ?name) (MAX(?image) AS ?imageUrl) (MIN(?birthDate) AS ?birthDate) (MIN(?deathDate) AS ?deathDate) WHERE {
        ?writer a dbo:Writer.
        ?writer dbp:name ?name.
        OPTIONAL {?writer dbp:birthDate ?birthDate.}
        OPTIONAL {?writer dbp:deathDate ?deathDate.}
        OPTIONAL  {?writer dbo:thumbnail ?image.}
        ?writer dbo:genre ?genre.
    	?genre rdfs:label ?genreLabel.
    	FILTER(lang(?genreLabel) = "en")
    	FILTER (regex(?genreLabel, "${name}", "i"))
    
        } ORDER BY ASC(?name) OFFSET ${limit}`;
  return await axiosQuery(query);
}

/**
 * Gives the first 10 books or authors found
 * on dbpedia containing the string passed in parameter sorted alphabetically
 * @param {String} text the name in parameter
 * @returns List of names associated with a type of Book or Writer
 */
export async function autocompleteQuery(text) {
  encodeResource(text);
  let query = [
    `SELECT DISTINCT ?name ?type
        WHERE {
        {{ ?uri a dbo:Book.
        ?uri dbp:name ?name. 
        BIND('Book' AS ?type)}
        UNION {
        ?uri dbp:name ?name.
        ?uri a dbo:Writer. 
        BIND('Writer' AS ?type)}} 
        FILTER (isLiteral(?name)) 
        FILTER(lang(?name) = "en") 
        FILTER (regex(?name, "${text}","i")) 
        }
        ORDER BY ASC(?name)
        LIMIT 10`,
  ].join("");
  return await axiosQuery(query);
}

export async function getBookSearch(name) {
  let resultSet = new Set();
  return Promise.all([
    researchQuery(name, 300).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
    getLiteraryGenre(name, 200).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
    getCountry(name, 100).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
    getHypernym(name, 200).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
  ]).then(() => {
    return Array.from(resultSet).sort(function (a, b) {
      /**
       * Criteres de comparaisons pour l'ordre des résultats:
       * 1. Le titre du livre contiens la chaine de characacteres `name` dans la recherche
       * 2. L'auteur du livre contiens `name` dans la recherche
       *
       * Dans le code une compaison réalisée en bas de la fonction a plus d'importance!
       */

      // Comparaison par nom de l'auteur
      // a est supérieur à b si son titre contiens le mot dans la recherche et que b non
      if (
        a.authorNames?.value.toUpperCase().includes(name.toUpperCase()) &&
        !b.authorNames?.value.toUpperCase().includes(name.toUpperCase())
      )
        return 1;
      // b est supérieur à a si son titre contiens le mot dans la recherche et que a non
      if (
        !a.authorNames?.value.toUpperCase().includes(name.toUpperCase()) &&
        b.authorNames?.value.toUpperCase().includes(name.toUpperCase())
      )
        return -1;

      // Comparaison par titre du livre
      // a est supérieur à b si son titre contiens le mot dans la recherche et que b non
      if (
        a.name.value.toUpperCase().includes(name.toUpperCase()) &&
        !b.name.value.includes(name.toUpperCase())
      )
        return 1;
      // b est supérieur à a si son titre contiens le mot dans la recherche et que a non
      if (
        !a.name.value.toUpperCase().includes(name.toUpperCase()) &&
        b.name.value.toUpperCase().includes(name.toUpperCase())
      )
        return -1;

      return 0;
    });
  });
}

export async function getAuthorSearch(name) {
  let resultSet = new Set();
  return Promise.all([
    getAuthors(name, 300).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
    getNationality(name, 200).then((result) => {
      result.forEach(resultSet.add, resultSet);
    }),
    // getOccupation(name, 100).then((result) => {
    //   result.forEach(resultSet.add, resultSet);
    // }),
    // getAuthorGenre(name, 200).then((result) => {
    //   result.forEach(resultSet.add, resultSet);
    // }),
    // getAuthorSubject(name, 200).then((result) => {
    //   result.forEach(resultSet.add, resultSet);
    // }),
    // getMovement(name, 200).then((result) => {
    //   result.forEach(resultSet.add, resultSet);
    // }),
  ]).then(() => {
    return Array.from(resultSet).sort(function (a, b) {
      /**
       * Criteres de comparaisons pour l'ordre des résultats:
       * 1. Le titre du livre contiens la chaine de characacteres `name` dans la recherche
       */

      // Comparaison par titre du livre
      // a est supérieur à b si son titre contiens le mot dans la recherche et que b non
      if (a.name.value.includes(name) && !b.name.value.includes(name)) return 1;
      // b est supérieur à a si son titre contiens le mot dans la recherche et que a non
      if (!a.name.value.includes(name) && b.name.value.includes(name))
        return -1;

      return 0;
    });
  });
}

async function axiosQuery(query) {
  let url = "http://dbpedia.org/sparql";
  query = query.replace(/&/g, "\\&");
  query = query.replace(/#/g, "%23");
  //console.log(query);
  let config = {
    params: {
      "default-graph-uri": "http://dbpedia.org",
      query: query,
      format: "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then((response) => resolve(response.data.results.bindings))
      .catch((err) => {
        console.error(err);
      });
  });
}
