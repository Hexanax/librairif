import axios from "axios";

export async function fetchBookInfo(resourceURI) {
    //TODO CHANGE HARDCODED URI
    resourceURI = resourceURI.replace(/[( ]/g, '\\(')
    resourceURI = resourceURI.replace(/[) ]/g, '\\)')
    console.log(resourceURI);
    const book = `dbr:${resourceURI}`;
    const content = `SELECT ?name ?titleOrig ?imageURL ?abstract ?authorURI ?authorName
    (GROUP_CONCAT(DISTINCT ?publisherURI;   SEPARATOR=", ") AS ?publishers)
    (GROUP_CONCAT(DISTINCT ?releaseDate;   SEPARATOR=", ") AS ?releaseDates)
    (GROUP_CONCAT(DISTINCT ?genre;   SEPARATOR=", ") AS ?genres)
        WHERE {
            ${book} dbp:name ?name;
            dbo:abstract ?abstract.
            OPTIONAL{${book} dbp:titleOrig ?titleOrig.}
            OPTIONAL{${book} dbp:releaseDate ?releaseDate.}
            OPTIONAL{${book} dbo:thumbnail ?imageURL.}
            OPTIONAL{${book} dbo:literaryGenre ?genre.}
            OPTIONAL{${book} dbp:publisher ?publisherURI.}
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
export async function fetchListInSeries(ressourceURI) {
    const currentBook = `dbr:${ressourceURI}`;
    let query = [
        `Select ?bookUri ?serie ?name ?imageURL WHERE {
        ${currentBook} dbo:series ?serie.
        ?bookUri a dbo:Book;
        dbp:name ?name;
        dbo:series ?serie.
        OPTIONAL{?bookUri dbo:thumbnail ?imageURL}
        }`
    ].join("");
    return await axiosQuery(query);
}

export async function getEditorInfo(editorName) {
    let editorRsrc = `dbr:${editorName}`;
    let query =
        `SELECT ?label ?abstract
    (GROUP_CONCAT(DISTINCT ?founded;   SEPARATOR=", ") AS ?foundingYears)
    (GROUP_CONCAT(DISTINCT ?founder;   SEPARATOR=", ") AS ?founders)
    (GROUP_CONCAT(DISTINCT ?homepage;    SEPARATOR=", ") AS ?homepages)
    (GROUP_CONCAT(DISTINCT ?headquarters; SEPARATOR=", ") AS ?headquartersLocations) WHERE {
      ${editorRsrc} rdfs:label ?label;
      dbo:abstract ?abstract.
      OPTIONAL{${editorRsrc} dbo:founder ?founder}
      OPTIONAL{${editorRsrc} dbo:foundingYear ?founded}
      OPTIONAL{${editorRsrc} foaf:homepage ?homepage}
      OPTIONAL{${editorRsrc} dbp:headquarters ?headquarters}
      FILTER(lang(?abstract) = "en").
      FILTER(lang(?label) = "en").
    }`
    console.log(query);
    return await axiosQuery(query);
}

/**
 * Allows to get the previous and the following book of the current one
 * @param {String} ressourceURI Uri of the current book
 * @returns ?book => the uri of the book; ?name => the name in english; ?position => before or after
 */
export async function fetchBookNeighbor(ressourceURI) {
    const currentBook = `dbr:${ressourceURI}`;
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
        FILTER(lang(?name) = "en") } ORDER BY DESC(?position)`
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
    let query = [
        `SELECT DISTINCT(STR(?label)) as ?game ?uri ?date ?developer
    WHERE{
        ?uri rdf:type dbo:VideoGame; 
        dbo:abstract ?abstract;
        dbo:releaseDate ?date;
        dbo:developer ?developer;
        rdfs:label ?label.
        Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))}
    GROUP BY ?game ?uri ?date ORDER BY ASC(?date) ASC(?game)`
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
    let query = [
        `SELECT DISTINCT(STR(?label)) as ?movie ?uri ?runtime
    (GROUP_CONCAT(DISTINCT ?producer; SEPARATOR=", ") AS ?producers)
    WHERE{
      ?uri rdf:type dbo:Film;
      dbo:abstract ?abstract;
      dbo:producer ?producer;
      dbo:runtime ?runtime;
      rdfs:label ?label.
      Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
    }`
    ].join("");
    console.log(query);
    return await axiosQuery(query);
}

/**
 * Allows to get the list of musicals based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedMusicals(name, author) {
    let query = [
        `SELECT DISTINCT(STR(?label)) as ?musical ?uri ?author ?lyric ?music
         WHERE{
            ?uri rdf:type dbo:Musical;
            dbo:abstract ?abstract;
            dbo:author ?author;
            dbo:lyrics ?lyric; 
            dbo:musicBy ?music;
            rdfs:label ?label.
            Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
        }
        GROUP BY ?musical ?uri ORDER BY ASC(?musical)`
    ].join("");
    return await axiosQuery(query);
}

/**
 * Allows to get the list of series based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedSeries(name, author) {
    let query = [
        `SELECT DISTINCT(STR(?label)) as ?serie ?uri ?composer ?season
         WHERE{
            ?uri rdf:type dbo:TelevisionShow;
            dbo:abstract ?abstract;
            dbo:composer ?composer;
            dbo:numberOfSeasons ?season;
            rdfs:label ?label.
            Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
        }
        ORDER BY ASC(?serie)`
    ].join("");
    return await axiosQuery(query);
}

/**
 * Allows to get the list of arts based on the book
 * @param {String} name the name of the current book
 * @param {String} author the author of the current book
 * @returns
 */
export async function fetchAssociatedArts(name, author) {
    let query = [
        `select DISTINCT(STR(?label)) as ?art ?uri ?image ?artist WHERE{
        ?uri rdf:type dbo:Artwork;
        dbo:abstract ?abstract;
        dbo:artist ?artist;
        dbo:thumbnail ?image;
        rdfs:label ?label.
        Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
        }
        GROUP BY ?art ?uri ?image ORDER BY ASC(?art)`
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
    let query = [
        `SELECT DISTINCT(STR(?label)) as ?music ?uri ?type ?artist
         WHERE{
        {{
      ?uri a dbo:Song;
      dbo:abstract ?abstract;
      dbo:artist ?artist;
      rdfs:label ?label.
      BIND("song" as ?type)
      } UNION {
      ?uri a dbo:Single;
      dbo:abstract ?abstract;
      rdfs:label ?label;
      dbo:artist ?artist.
      BIND("single" as ?type)
      } UNION {
      ?uri a dbo:Sound;
      dbo:abstract ?abstract;
      rdfs:label ?label.
      BIND("sound" as ?type)
      }}
        Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))
       }
        GROUP BY ?music ?uri ?type ORDER BY ASC(?music)`,
    ].join("");
    return await axiosQuery(query);
}

export async function queryAuthor(authorURI) {
    let author = `dbr:${authorURI}`;
    let query = `SELECT ?name ?description ?birthDate ?deathDate ?occupation ?educ ?image 
  GROUP_CONCAT(DISTINCT ?listAwards, ";") as ?listAwards 
  GROUP_CONCAT(DISTINCT ?listGenres, ";") as ?listGenres 
  GROUP_CONCAT(DISTINCT ?books, ";") as ?books
  WHERE {
  ${author} dbp:name ?name.
  ${author} dbo:abstract ?description.
  OPTIONAL{${author} dbo:birthDate ?birthDate}
  OPTIONAL{${author} dbo:deathDate ?deathDate}
  OPTIONAL{${author} dbo:thumbnail ?image}
  OPTIONAL{${author} dbp:occupation ?occupation}
  OPTIONAL{${author} dbo:education ?education. ?education rdfs:label ?educ}
  OPTIONAL{${author} dbp:awards ?awards. ?awards rdfs:label ?listAwards}
  OPTIONAL{${author} ^dbp:author ?books}
  OPTIONAL{${author} dbo:genre ?genres. ?genres rdfs:label ?listGenres}
  FILTER(lang(?description) = "en")
  FILTER(lang(?educ) = "en")
  FILTER(lang(?listAwards) = "en")
  FILTER(lang(?listGenres) = "en")
  }`;
    console.log("query" + query);
    return await axiosQuery(query);
}


export async function getAuthorTimeLife(ressourceURI) {
    const currentAuthor = `dbr:${ressourceURI}`;
    let query = [
        `SELECT ?birthDate ?deathDate GROUP_CONCAT(?notableWorkName, ";") GROUP_CONCAT(?releaseDate, ";") WHERE {
        ${currentAuthor} a dbo:Writer;
        dbo:birthDate ?birthDate;
        dbo:notableWork ?notableWork.
        ?notableWork dbp:name ?notableWorkName.
        ?notableWork dbp:releaseDate ?releaseDate.
        OPTIONAL{${currentAuthor} dbo:deathDate ?deathDate }}`
    ].join("");
    return await axiosQuery(query);
}

export async function researchQuery(bookName, author) {

    let query = `SELECT ?authorName ?book
  (MIN(?name) AS ?name)
  (MIN(?releaseDate) AS ?releaseDate)
  (MAX(?imageURL) AS ?imageUrl)
  (MAX(?abstract) AS ?abstract) 

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
    FILTER (regex(?name, "${bookName}", "i"))
    FILTER (regex(?author, "${author}",  "i"))

    } GROUP BY ?authorName ?book`

    return await axiosQuery(query);
}

/**
 * Gives the first 10 books or authors found
 * on dbpedia containing the string passed in parameter sorted alphabetically
 * @param {String} text the name in parameter
 * @returns List of names associated with a type of Book or Writer
 */
export async function autocompleteQuery(text) {
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
        FILTER (regex(?name, '${text}',"i")) 
        }
        ORDER BY ASC(?name)
        LIMIT 10`
    ].join("");
    return await axiosQuery(query);
}

export async function getSearch(name) {
    return new Promise((resolve, reject) => {

        researchQuery(name, "").then(results1 => {
            researchQuery("", name).then(results2 => {
                let finalResults = results1.concat(results2);
                return resolve(finalResults.sort((a, b) => {
                    return a.name.value.toUpperCase().localeCompare(b.name.value.toUpperCase())
                }));
            });
        });
    });
}

async function axiosQuery(query) {
    let url = "http://dbpedia.org/sparql";
    query  = query.replace(/&/g, "\\&");
    query = query.replace(/#/g, "%23");
    console.log(query);
    let config = {
        params: {
            "default-graph-uri": "http://dbpedia.org",
            "query" : query,
            "format":"application/json"
        },
    }
    return new Promise((resolve, reject) => {
        axios
            .get(url, config)
            .then((response) => resolve(response.data.results.bindings))
            .catch((err) => {
                console.error(err);
            });
    });

}
