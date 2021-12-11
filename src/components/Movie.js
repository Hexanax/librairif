const Movie = (props) => {
    return <div className={"movie"}>
        <span>Movie's title : </span>
        <span>{props.movie.movie.value}</span>
        <br/>
        <span>Resource URI : </span>
        <span>{props.movie.uri.value}</span>
        <br/>
        <span>Producers : </span>
        <span>{props.movie.producers.value}</span>
        <br/>
        <span>Runtime : </span>
        <span>{timeConvert(props.movie.runtime.value)}</span>
        <br/>
    </div>
}

function timeConvert(num) {
    let hours = Math.floor(num / 60);
    let minutes = num % 60;
    return hours + "h" + minutes;
}

export default Movie