import axios from "axios";

export async function getBookInfo(resourceURI) {
  //TODO CHANGE HARDCODED URI
  const book = `dbr:${resourceURI}`;
  const content = `SELECT ?name ?titleOrig ?releaseDate ?imageURL ?abstract ?authorURI ?authorName ?publisherURI
        WHERE {
        ${book} dbp:name ?name;
        dbp:titleOrig ?titleOrig;
        dbp:releaseDate ?releaseDate;
        dbo:thumbnail ?imageURL;
        dbo:abstract ?abstract;
        dbp:publisher ?publisherURI;
        dbp:author ?authorURI.
        ?authorURI dbp:name ?authorName.
        FILTER(lang(?abstract) = "en")
        FILTER(lang(?releaseDate) = "en")
        }
        GROUP BY ?publisherURI`;
  console.log(content);
  return await axiosQuery(content);
}
export async function getEditorInfo(editorName){
  let editorRsrc = `dbr:${editorName}`;
  let query = [
    "SELECT DISTINCT ?label ?abstract ?founded ?homepage ?headquarters ?founder",
    "WHERE {",
    ` ${editorRsrc} rdfs:label ?label;`,
        'dbo:abstract ?abstract;',
        'dbo:founder ?founder;',
        'dbo:foundingYear ?founded;',
        'foaf:homepage ?homepage;',
        'dbp:headquarters ?headquarters.',
        'FILTER(lang(?abstract) = "en").',
        'FILTER(lang(?label) = "en").',
    "}",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the previous and the following book of the current one
 * @param {String} ressourceURI Uri of the current book
 * @returns ?book => the uri of the book; ?name => the name in english; ?position => before or after
 */
export async function getBookNeighbor(ressourceURI){
  const currentBook = `dbr:${ressourceURI}`;
  let query = [
    "Select ?book ?name ?position WHERE { ",
    "{{ ",
    `${currentBook} dbp:precededBy ?book. `,
    "?book a dbo:Book. ",
    "?book rdfs:label ?name. ",
    "BIND('before' AS ?position) ",
    "} UNION { ",
    `${currentBook} dbp:followedBy ?book. `,
    "?book a dbo:Book. ",
    "?book rdfs:label ?name. ",
    "BIND('after' AS ?position) ",
    "}} ORDER BY DESC(?position)",
    'FILTER(lang(?name) = "en") }',
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of games based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
export async function getAssociatedGames(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?game ?uri ?date ?developer where{ ",
    "?uri rdf:type dbo:VideoGame; ",
    "dbo:abstract ?abstract; ",
    "dbo:releaseDate ?date; ",
    "dbo:developer ?developer; ",
    "rdfs:label ?label. ",
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "GROUP BY ?game ?uri ?date ORDER BY ASC(?date) ASC(?game)",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of movies based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
 export async function getAssociatedMovies(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?movie ?uri ?runtime ?producer where{ ",
    "?uri rdf:type dbo:Film; ",
    "dbo:abstract ?abstract; ",
    "dbo:producer ?producer; ",
    "dbo:runtime ?runtime; ",
    "rdfs:label ?label. ",
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "GROUP BY ?movie ?uri ?runtime ORDER BY ASC(?movie)",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of musicals based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
 export async function getAssociatedMusicals(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?musical ?uri ?author ?lyric ?music where{ ",
    "?uri rdf:type dbo:Musical; ",
    "dbo:abstract ?abstract; ",
    "dbo:author ?author; ",
    "dbo:lyrics ?lyric; ",
    "dbo:musicBy ?music; ",
    "rdfs:label ?label. ",
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "GROUP BY ?musical ?uri ORDER BY ASC(?musical)",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of series based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
 export async function getAssociatedSeries(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?serie ?uri ?composer ?season where{ ",
    "?uri rdf:type dbo:TelevisionShow; ",
    "dbo:abstract ?abstract; ",
    "dbo:composer ?composer; ",
    "dbo:numberOfSeasons ?season; ",
    "rdfs:label ?label. ",
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "ORDER BY ASC(?serie)",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of arts based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
 export async function getAssociatedArts(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?art ?uri ?image ?artist where{ ",
    "?uri rdf:type dbo:Artwork; ",
    "dbo:abstract ?abstract; ",
    "dbo:artist ?artist; ",
    "dbo:thumbnail ?image; ",
    "rdfs:label ?label. ",
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "GROUP BY ?art ?uri ?image ORDER BY ASC(?art)",
  ].join("");
  return await axiosQuery(query);
}

/**
 * Allows to get the list of musics based on the book
 * @param {String} name the name of the current book 
 * @param {String} author the author of the current book
 * @returns 
 */
 export async function getAssociatedMusics(name, author){
  let query = [
    "select DISTINCT(STR(?label)) as ?music ?uri ?type ?artist where{ ",
    ` {{
      ?uri a dbo:Song;
      dbo:abstract ?abstract;
      dbo:artist ?artist;
      rdfs:label ?label.
      BIND("song" as ?type)
      } UNION {
      ?uri a dbo:Single;
      dbo:abstract ?abstract;
      rdfs:label ?label.
      dbo:artist ?artist;
      BIND("single" as ?type)
      } UNION {
      ?uri a dbo:Sound;
      dbo:abstract ?abstract;
      rdfs:label ?label.
      BIND("sound" as ?type)
      }}`,
    `Filter(( lang(?label)="en" and lang(?abstract)="en" ) and (regex(?abstract,"${name}","i")) and (regex(?abstract,"${author}","i")))} `,
    "GROUP BY ?music ?uri ?type ORDER BY ASC(?music)",
  ].join("");
  return await axiosQuery(query);
}

export async function queryAuthor() {
  let query = [
    'SELECT ?name, GROUP_CONCAT(DISTINCT ?listGenres, ";"), GROUP_CONCAT(DISTINCT ?listBooks, ";") WHERE {',
    "?writer a dbo:Writer.",
    "?writer dbp:name ?name.",
    "?writer dbp:occupation ?occupation.",
    "?writer dbo:thumbnail ?image.",
    "?writer ^dbp:author ?books.",
    "?books rdfs:label ?listBooks.",
    "?writer dbo:genre ?genres.",
    "?genres rdfs:label ?listGenres.",
    'FILTER(lang(?listBooks) = "en").',
    'FILTER(lang(?listGenres) = "en").',
    'FILTER (regex(?name, "Antoine de"))',
    "}",
  ].join("");
  return await axiosQuery(query);
}

export async function researchQuery(bookName, author) {
  let query = `SELECT ?name ?authorName ?book
  (GROUP_CONCAT(DISTINCT ?releaseDate;   SEPARATOR=", ") AS ?releaseDates)
  (GROUP_CONCAT(DISTINCT ?imageURL;   SEPARATOR=", ") AS ?imageUrls)
  (GROUP_CONCAT(DISTINCT ?abstract;   SEPARATOR=", ") AS ?abstracts) 
    WHERE {
    ?book a dbo:Book.
    ?book dbp:name ?name.
    ?book dbo:author ?author;
    dbo:abstract ?abstract.
    OPTIONAL {?book dbo:thumbnail ?imageURL;
    dbp:releaseDate ?releaseDate.}
    ?author dbp:name ?authorName.
    FILTER(lang(?name) = "en")
    FILTER(lang(?abstract) = "en")
    FILTER (regex(?name, "${bookName}", "i"))
    FILTER (regex(?author, "${author}",  "i"))
    } GROUP BY ?name ?authorName ?book`

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
    "SELECT DISTINCT ?name ?type ",
    "WHERE { ",
    "{{ ?uri a dbo:Book. ",
    "?uri dbp:name ?name.  ",
    "BIND('Book' AS ?type)} ",
    "UNION { ",
    "?uri dbp:name ?name. ",
    "?uri a dbo:Writer. ",
    "BIND('Writer' AS ?type)}} ",
    `FILTER (isLiteral(?name)) `,
    'FILTER(lang(?name) = "en") ',
    `FILTER (regex(?name, '${text}',"i")) `,
    "} ",
    "ORDER BY ASC(?name) ",
    "LIMIT 10 ",
  ].join("");
  return await axiosQuery(query);
}

async function axiosQuery(query) {
  let url = "http://dbpedia.org/sparql";
  let queryURL = encodeURI(url + "?query=" + query + "&format=json");
  queryURL = queryURL.replace(/#/g, "%23");
  return new Promise((resolve, reject) => {
    axios
      .get(queryURL)
      .then((response) => resolve(response.data.results.bindings))
      .catch((err) => {
        console.error(err);
      });
  });
}
