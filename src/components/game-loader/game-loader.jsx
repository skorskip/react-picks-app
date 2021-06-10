import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import "./game-loader.css";

export const GameLoader = ({height, count}) => {

    const game = (
        <div className="game-card">
            <div className="team-group">
                <Placeholder style={{ height: parseInt(height), width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
                <Placeholder style={{ height: parseInt(height), width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
            </div>
        </div>
    );

    return (
        <>
            { Array(parseInt(count)).fill(game) }
        </>
    )
}