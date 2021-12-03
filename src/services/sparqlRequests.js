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

