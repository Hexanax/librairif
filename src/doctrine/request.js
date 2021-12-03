/*

Autocompletion -> "Prince" is the current research
Select DISTINCT STR(?n) where {
 {{
    ?uri dbp:name ?n.
    ?uri a dbo:Book.
} UNION {
?uri dbp:name ?n.
    ?uri a dbo:Writer.
    }}

FILTER(isLiteral(?n))
FILTER regex(?n, "Prince", "i")
}
 */