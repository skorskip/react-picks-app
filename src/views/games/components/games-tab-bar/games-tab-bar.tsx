import React, { useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { NAV_DONE_BUTTON, NAV_EDIT_BUTTON } from '../../../../configs/topics';
import { PubSub } from '../../../../controller/pubSub/pubSubSlice';
import { PickButton } from '../../../../common/PickButton/PickButton';
import { League } from '../../../../model/league/league';

import './games-tab-bar.css';

interface RouteParams {
    view: string
}

type Props = {
    league: League,
    pickCount: number,
    tabBarEvent: (publish: PubSub) =>  void
}

export const GamesTabBar = ({league, pickCount, tabBarEvent}: Props) => {
    let param = useParams<RouteParams>();
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

    const selectEdit = () => {
        tabBarEvent(new PubSub(NAV_EDIT_BUTTON, true));
        setIsEditSelected(true);
    }

    const selectDone = () => {
        tabBarEvent(new PubSub(NAV_DONE_BUTTON, true));
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
        />
    )

    const doneButton = (param.view === "pick" && isEditSelected) && (
        <PickButton 
            type="primary"
            clickEvent={selectDone}
            content="Done"
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
                    content={(<div><Icon name='hand point down' className='game-toggle-icon'/>Picks ({pickCount})</div>)}
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