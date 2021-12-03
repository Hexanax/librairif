import axios from 'axios'

export async function getBookInfo(pageId){
    var content = "SELECT ?name ?titleOrig ?releaseDate ?imageURL ?abstract ?author\n" +
        "WHERE {\n" +
        "?book a dbo:Book.\n" +
        "?book dbp:name ?name.\n" +
        "?book dbo:wikiPageID ?wikiPageId.\n" +
        `FILTER (?wikiPageId = ${pageId})\n` +
        "?book dbp:titleOrig ?titleOrig.\n" +
        "?book dbp:releaseDate ?releaseDate.\n" +
        "FILTER(lang(?releaseDate) = \"en\")\n" +
        "?book dbo:thumbnail ?imageURL.\n" +
        "?book dbo:abstract ?abstract.\n" +
        "FILTER(lang(?abstract) = \"en\")\n" +
        "?book dbo:author ?author.\n" +
        "}"
    var url_base = "http://dbpedia.org/sparql";
    var url = url_base + "?query=" + encodeURIComponent(content) + "&format=json";

    try{
        const response = axios.get(url);
        console.log(response);
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
