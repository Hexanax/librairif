import axios from 'axios'

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
        }`
    const url_base = "http://dbpedia.org/sparql";
    const url = url_base + "?query=" + encodeURIComponent(content) + "&format=json";

    try{
        const response = await axios.get(url);
        const data = response.data.results.bindings;
        console.log(data);
        return response;
    }catch(error){
        console.log(error);
    }
}


export async function queryAuthor() {
    let url = 'http://dbpedia.org/sparql';
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

    let queryURL = encodeURI(url + '?query=' + query + '&format=json');
    queryURL = queryURL.replace(/#/g, '%23');
    try{
        const response = axios.get(queryURL);
        console.log(response);
        return response;
    }catch(error){
        console.log(error);
    }
}
