import React, { useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON } from '../../../../configs/topics';
import { useDispatch, useSelector } from 'react-redux';
import { selectLeague } from '../../../../controller/league/leagueSlice';
import { publish, PubSub } from '../../../../controller/pubSub/pubSubSlice';
import './games-tab-bar.css';
import { selectPicksCount } from '../../../../controller/week/weekSlice';
import { PickButton } from '../../../../shared/PickButton/PickButton';

interface RouteParams {
    view: string
}

export const GamesTabBar = () => {
    let param = useParams<RouteParams>();
    const league = useSelector(selectLeague);
    const pickCount = useSelector(selectPicksCount);
    const history = useHistory();
    const [isEditSelected, setIsEditSelected] = useState(false);
    const currentWeek = league.currentWeek.toString();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const season = query.get("season");
    const week = query.get("week") ? query.get("week") : currentWeek;
    const seasonType = query.get("seasonType");
    const weekQuery = `?season=${season}&seasonType=${seasonType}&week=${week}`;
    const dispatch = useDispatch();

    const clickView = (view: string) => {
        if(season === null) {
            history.push(`/games/${view}`);
        } else {
            history.push(`/games/${view}${weekQuery}`);
        }
    }

    const selectEdit = () => {
        dispatch(publish(new PubSub(NAV_EDIT_BUTTON, true)));
        setIsEditSelected(true);
    }

    const selectDone = () => {
        dispatch(publish(new PubSub(NAV_DONE_BUTTON, true)));
        setIsEditSelected(false);
    }

    const editButton = (
        param.view === "pick" && 
        !isEditSelected && 
        pickCount > 0 && 
        week === currentWeek) && (
        <PickButton 
            type="secondary"
            clickEvent={selectEdit}
            content="Edit"
            styling={null}
        />
    )

    const doneButton = (param.view === "pick" && isEditSelected) && (
        <PickButton 
            type="primary"
            clickEvent={selectDone}
            content="Done"
            styling={null}
        />
    )

    return (
        <div className="toggle-picks-container base-background">
            <div className="toggle-container tiertary-light-background">
                <PickButton 
                    type={(param.view === "game") ? "primary" : "secondary"}
                    clickEvent={() => clickView("game")}
                    content={(<div><Icon name='football ball' className='game-toggle-icon'/>Games</div>)}
                    styling="toggle-button"
                />
                <PickButton 
                    type={(param.view === "pick") ? "primary" : "secondary"}
                    clickEvent={() => clickView("pick")}
                    content={(<div><Icon name='hand point down' className='game-toggle-icon'/>Picks</div>)}
                    styling="toggle-button"
                />
            </div>
            <div className="edit-button-container">
                { editButton }
                { doneButton }
            </div>
        </div>
    )
}