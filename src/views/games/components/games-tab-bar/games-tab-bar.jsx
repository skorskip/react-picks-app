import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useState } from 'react/cjs/react.development';
import { Button } from 'semantic-ui-react';
import { publish, NAV_EDIT_BUTTON, NAV_DONE_BUTTON } from '../../../../utils/pubSub';
import './games-tab-bar.css';

export const GamesTabBar = ({pickCount}) => {
    let { view } = useParams();
    const history = useHistory();
    const [isEditSelected, setIsEditSelected] = useState(false);

    const clickView = (view) => {
        history.push("/games/" + view);
    }

    const getButtonClass = (selectedView) => {
        if(view === selectedView) {
            return "toggle-button primary-background base-color";
        } else {
            return "toggle-button tiertary-light-background";
        }
    }

    const selectEdit = () => {
        publish(NAV_EDIT_BUTTON, true);
        setIsEditSelected(true);
    }

    const selectDone = () => {
        publish(NAV_EDIT_BUTTON, null);
        publish(NAV_DONE_BUTTON, true);
        setIsEditSelected(false);
    }

    const editButton = (view === "pick" && !isEditSelected) && (
        <Button basic onClick={() => selectEdit()}>Edit</Button>
    )

    const doneButton = (view === "pick" && isEditSelected) && (
        <Button basic onClick={() => selectDone()}>Done</Button>
    )

    return (
        <div className="toggle-picks-container base-background">
            <div className="toggle-container tiertary-light-background">
                <Button className={getButtonClass("game")} onClick={() => clickView("game")}>
                    Games
                </Button>
                <Button className={getButtonClass("pick")} onClick={() =>clickView("pick")}>
                    Picks({pickCount})
                </Button>
            </div>
            <div className="edit-button-container">
                { editButton }
                { doneButton }
            </div>
        </div>
    )
}