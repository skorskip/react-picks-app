import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import './games-tab-bar.css';

export const GamesTabBar = ({pickCount}) => {
    let { view } = useParams();
    const linkView = view;
    const history = useHistory();

    const clickView = (view) => {
        history.push("/games/" + view);
    }

    const getButtonClass = (selectedView) => {
        let opt = {}
        if(linkView === selectedView) {
            opt[`primary`] = `primary`;
            return opt;
        } else {
            opt[`basic`] = `basic`;
            opt[`secondar`] = `secondary`;
            return opt;
        }
    }

    return (
        <div className="toggle-picks-container base-background">
            <div className="toggle-container">
                <Button {...getButtonClass("game")} className="toggle-button" onClick={() => clickView("game")}>
                    Games
                </Button>
                <Button {...getButtonClass("pick")} className="toggle-button" onClick={() =>clickView("pick")}>
                    Picks ({pickCount})
                </Button>
            </div>
            <div>
                <Button basic>Edit</Button>
            </div>
        </div>
    )
}