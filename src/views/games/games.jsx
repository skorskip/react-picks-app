import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { selectPicksIds, fetchPicks } from '../../controller/picks/picksSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { Switch, Route, useLocation, useParams } from "react-router-dom";
import { GamesTabBar } from './components/games-tab-bar/games-tab-bar';
import { WeekSwitcher } from '../../components/week-switcher/week-switcher';
import {  TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon } from 'semantic-ui-react';
import { WEEK_SHOW_WEEKS, Subscriber } from '../../utils/pubSub';
import "./games.css";
import "../../utils/slideTransition.scss";

export const Games = ({routes}) => {
    const user = useSelector(selectUser);
    const league = useSelector(selectLeague);
    const pickIds = useSelector(selectPicksIds);
    const dispatch = useDispatch();
    let location = useLocation();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const animationTime = { enter: 200, exit: 200};
    let { view } = useParams();
    const season = query.get("season") === null ? league.currentSeason : query.get("season");
    const week = query.get("week") === null ? league.currentWeek : query.get("week");
    const seasonType = query.get("seasonType") === null ? league.currentSeasonType : query.get("seasonType");
    const [weeksShown, setWeeksShown] = useState(false);

    const showWeeks = (show) => {
        setWeeksShown(show);
    }

    const spectatorView = (user.type !== 'participant') && (
        <div className="header-container">
            <div className="spectator-container warn-background">
                <div class="base-color spectator-icon">
                    <Icon name="binoculars" />
                </div>
                <span class="base">
                    Spectator Mode
                </span>
            </div>
        </div>
    );

    const gamesTab = (user.type === 'participant') && (
        <GamesTabBar pickCount={pickIds.length}/>
    )

    const transitionGroup = (!weeksShown) && (
        <TransitionGroup component="div" className="route-container">
            <CSSTransition 
                key={view} 
                timeout={animationTime} 
                classNames="pageSlider" 
                mountOnEnter={false} 
                unmountOnExit={true}>
                <div className={view === "pick" ? "left" : "right"}>
                    <Switch location={location}>
                        {routes.map((route, i) =>(
                            <Route
                                key={i}
                                path={route.path}
                                render={props => (<route.component key={i} />)}
                            />
                        ))}
                    </Switch>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );

    useEffect(() => {
        if(season !== null && week !== null && seasonType !== null){
            dispatch(fetchGames({ season: season, seasonType: seasonType, week: week, user: user }));
            dispatch(fetchPicks({ season: season, seasonType: seasonType, week: week, user: user }));
        }
    }, [dispatch, user, season, week, seasonType])

    return (
        <>
            <Subscriber topic={WEEK_SHOW_WEEKS}>
                {data => (<>{showWeeks(data)}</>)}
            </Subscriber>
            { spectatorView }
            { gamesTab }
            <div className="week-switcher-container">
                <WeekSwitcher />
            </div>
            { transitionGroup }
        </>
    );
}