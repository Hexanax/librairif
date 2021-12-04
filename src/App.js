import Results from "./components/Results";
import Browser from "./components/Browser";

let books = [{ name: { value: 'Le prince' }, author: { value: 'Nicolas Machiavel' }, "callret-3": { value: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Machiavelli_Principe_Cover_Page.jpg/300px-Machiavelli_Principe_Cover_Page.jpg" } },
{ name: { value: 'Le prince' }, author: { value: 'Nicolas Machiavel' }, "callret-3": { value: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Machiavelli_Principe_Cover_Page.jpg/300px-Machiavelli_Principe_Cover_Page.jpg"} },    
{ name: {value: "L'art de la guerre"}, author: {value: 'Sun Tzu'}, "callret-3": {value: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bamboo_book_-_closed_-_UCR.jpg/300px-Bamboo_book_-_closed_-_UCR.jpg"}},
{ name: {value: "L'art de la guerre"}, author: {value: 'Sun Tzu'}, "callret-3": {value: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bamboo_book_-_closed_-_UCR.jpg/300px-Bamboo_book_-_closed_-_UCR.jpg"}},
{ name: {value: "L'art de la guerre"}, author: {value: 'Sun Tzu'}, "callret-3": {value: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Bamboo_book_-_closed_-_UCR.jpg/300px-Bamboo_book_-_closed_-_UCR.jpg"}}
];

export default function App() {
  return (
    <Results books={books} />
  );
}
