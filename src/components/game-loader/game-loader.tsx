import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import "./game-loader.css";

type Props = {
    height: number,
    count: number
}

export const GameLoader = ({height, count}: Props) => {

    const fill = Array(count).fill("");

    const game = (
        <div className="game-card">
            <div className="team-group">
                <Placeholder className="tiertary-light-background" style={{ height: height, width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
                <Placeholder className="tiertary-light-background" style={{ height: height, width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
            </div>
        </div>
    );

    const gameLoader = fill.map((item, i) => {
        return (
            <div key={i + "-game-loader"}>
                { game }
            </div>
        )
    })

    return (
        <>
            { gameLoader }
        </>
    )
}