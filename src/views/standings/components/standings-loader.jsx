import React from 'react';
import { Placeholder } from 'semantic-ui-react';

export const StandingsLoader = () => {
    const loader = (
        <Placeholder className="tiertary-light-background" style={{ height: 59, width: "100%", borderRadius: "1em", margin: 4, padding: 10}}>
            <Placeholder.Image />
        </Placeholder>
    )

    return (
        <>
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
            { loader }
        </>
    )
}