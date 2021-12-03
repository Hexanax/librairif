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

