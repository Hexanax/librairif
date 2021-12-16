const Game = (props) => {
    ////console.log("Props game = " + JSON.stringify(props.game))
    return <div className={"game"}>
        <span>Game's title : </span>
        <span>{props.game.game.value}</span>
        <br/>
        <span>Resource URI : </span>
        <span>{props.game.uri.value}</span>
        <br/>
        <span>Developer : </span
        ><span>{props.game.developer.value}</span>
    </div>
}

export default Game