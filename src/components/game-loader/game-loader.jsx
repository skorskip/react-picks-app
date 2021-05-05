import React from 'react';
import { Placeholder } from 'semantic-ui-react';
import "./game-loader.css";

export const GameLoader = () => {
    const game = (
        <div className="game-card">
            <div className="team-group">
                <Placeholder style={{ height: 110, width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
                <Placeholder style={{ height: 110, width: 150, borderRadius: "1em", margin: 0}}>
                    <Placeholder.Image />
                </Placeholder>
            </div>
        </div>
    )

    return (
        <>
            { game }
            { game }
            { game }
            { game }
            { game }
            { game }
            { game }
            { game }
        </>
    )
}