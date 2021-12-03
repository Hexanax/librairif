query = `SELECT ?name ?releaseDate ?imageURL ?authorName
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
}`;
