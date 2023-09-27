import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import "./game-loader.css";

type Props = {
    height: number,
    borderRadius?: string,
    width?: number,
    rowCount?: number,
    count: number
}

export const GameLoader = ({height, width=150, count, rowCount=2, borderRadius = "1rem", }: Props) => {

    const fill = Array(count).fill("");
    const row = Array(rowCount).fill("");

    const rowLoader = row.map(i => {
        return (
            <Placeholder className="tiertary-light-background" style={{ height, width, borderRadius, margin: 0}}>
                <Placeholder.Image />
            </Placeholder>
        );
    })

    const game = (
        <div className="game-card">
            <div className="team-group">
                { rowLoader }
            </div>
        </div>
    );

    const gameLoader = fill.map((item, i) => {
        return (
            <div key={i + "-game-loader"} className='container'>
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