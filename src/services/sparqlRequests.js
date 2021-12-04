import axios from 'axios';

export async function getBookInfo(resourceURI){
    //TODO CHANGE HARDCODED URI
    const book = `dbr:${"The_Little_Prince"}`
    const content = `SELECT ?name ?titleOrig ?releaseDate ?imageURL ?abstract ?author
        WHERE {
        ${book} dbp:name ?name;
        dbp:titleOrig ?titleOrig;
        dbp:releaseDate ?releaseDate;
        dbo:thumbnail ?imageURL;
        dbo:abstract ?abstract;
        dbp:author ?author.
        FILTER(lang(?abstract) = "en")
        FILTER(lang(?releaseDate) = "en")
        }`;
    return await axiosQuery(content);
}

export async function getSearchResults() {
  //TODO CHANGE HARDCODED URI
  const book = `dbr:${"The_Little_Prince"}`;
  const content = `SELECT ?name ?releaseDate ?imageURL ?authorName
  WHERE {
  ?book a dbo:Book.
  ?book dbp:name ?name.
  ?book dbp:titleOrig ?titleOrig.
  ?book dbp:releaseDate ?releaseDate.
  FILTER(lang(?releaseDate) = "en")
  ?book dbo:thumbnail ?imageURL.
  ?book dbo:abstract ?abstract.
  FILTER(lang(?abstract) = "en")
  ?book dbo:author ?author.
  ?author dbp:name ?authorName
  } LIMIT 100`;
  const url_base = "http://dbpedia.org/sparql";
  const url =
    url_base + "?query=" + encodeURIComponent(content) + "&format=json";

  try {
    const response = await axios.get(url);
    const data = response.data.results.bindings;
    return data;
  } catch (error) {
    console.log(error);
  }
}


export async function queryAuthor() {
    let query = [
        'SELECT ?name, GROUP_CONCAT(DISTINCT ?listGenres, ";"), GROUP_CONCAT(DISTINCT ?listBooks, ";") WHERE {',
        '?writer a dbo:Writer.',
        '?writer dbp:name ?name.',
        '?writer dbp:occupation ?occupation.',
        '?writer dbo:thumbnail ?image.',
        '?writer ^dbp:author ?books.',
        '?books rdfs:label ?listBooks.',
        '?writer dbo:genre ?genres.',
        '?genres rdfs:label ?listGenres.',
        'FILTER(lang(?listBooks) = "en").',
        'FILTER(lang(?listGenres) = "en").',
        'FILTER (regex(?name, "Antoine de"))',
        '}',
    ].join('');
    return await axiosQuery(query);
}

export async function researchQuery(bookName, author) {
    let query = [
        'SELECT ?name ?author MIN(?titleOrig) MIN(?imageURL) MIN(?abstract)',
        'WHERE {',
        '?book a dbo:Book.',
        '?book dbp:name ?name.',
        '?book dbo:author ?author.',
        '?book dbp:titleOrig ?titleOrig.',
        '?book dbo:thumbnail ?imageURL.',
        '?book dbo:abstract ?abstract.',
        'FILTER(lang(?name) = "en")',
        'FILTER(lang(?abstract) = "en")',
        `FILTER (regex(?name, "${bookName}"))`,
        `FILTER (regex(?author, "${author}"))`,
        '} GROUP BY ?name ?author'].join('');
    return await axiosQuery(query);
}

async function axiosQuery(query) {
    let url = 'http://dbpedia.org/sparql';
    let queryURL = encodeURI(url + '?query=' + query + '&format=json');
    queryURL = queryURL.replace(/#/g, '%23');
    return new Promise((resolve, reject) => {
        axios.get(queryURL)
            .then(response => resolve(response))
            .catch(err => {
                console.error(err);
            });
    });
}
