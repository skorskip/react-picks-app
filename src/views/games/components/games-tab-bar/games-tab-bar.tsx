import React, { useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import { publish, NAV_EDIT_BUTTON, NAV_DONE_BUTTON } from '../../../../utils/pubSub';
import { useSelector } from 'react-redux';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import './games-tab-bar.css';

interface RouteParams {
    slug: string
}

type Props = {
    pickCount: number
}

export const GamesTabBar = ({pickCount}:Props) => {
    let view = useParams<RouteParams>();
    const league = useSelector(selectLeague);
    const history = useHistory();
    const [isEditSelected, setIsEditSelected] = useState(false);
    const currentWeek = league.currentWeek.toString();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const season = query.get("season");
    const week = query.get("week") ? query.get("week") : currentWeek;
    const seasonType = query.get("seasonType");
    const weekQuery = `?season=${season}&seasonType=${seasonType}&week=${week}`;

    const clickView = (view: string) => {
        if(season === null) {
            history.push(`/games/${view}`);
        } else {
            history.push(`/games/${view}${weekQuery}`);
        }
    }

    const getButtonClass = (selectedView: string) => {
        if(view.slug === selectedView) {
            return "toggle-button primary-background base-color";
        } else {
            return "toggle-button tiertary-light-background secondary-color";
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

    const editButton = (
        view.slug === "pick" && 
        !isEditSelected && 
        pickCount > 0 && 
        week === currentWeek) && (
        <Button className="tiertary-light-background secondary-color" onClick={() => selectEdit()}>Edit</Button>
    )

    const doneButton = (view.slug === "pick" && isEditSelected) && (
        <Button className="primary-background base-color" onClick={() => selectDone()}>Done</Button>
    )

    return (
        <div className="toggle-picks-container base-background">
            <div className="toggle-container tiertary-light-background">
                <Button className={getButtonClass("game")} onClick={() => clickView("game")}>
                    <Icon name='football ball' className='game-toggle-icon'/>Games 
                </Button>
                <Button className={getButtonClass("pick")} onClick={() =>clickView("pick")}>
                    <Icon name='hand point down' className='game-toggle-icon'/> Picks ({pickCount})
                </Button>
            </div>
            <div className="edit-button-container">
                { editButton }
                { doneButton }
            </div>
        </div>
    )
}