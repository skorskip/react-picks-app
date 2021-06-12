import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { selectPicksIds, fetchPicks } from '../../controller/picks/picksSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { Switch, Route, useLocation, useParams } from "react-router-dom";
import { GamesTabBar } from './components/games-tab-bar/games-tab-bar';
import { WeekSwitcher } from '../../components/week-switcher/week-switcher';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon } from 'semantic-ui-react';
import { WEEK_SHOW_WEEKS, Subscriber } from '../../utils/pubSub';
import "./games.css";
import "../../utils/slideTransition.scss";
import { fetchUserPickData } from '../../controller/user-pick-data/userPickDataSlice';
import { PickPeekModal } from '../../components/pick-peek-modal/pick-peek-modal';

export const Games = ({routes}) => {
    const user = useSelector(selectUser);
    const league = useSelector(selectLeague);
    const pickIds = useSelector(selectPicksIds);
    const gamesState = useSelector((state) => state.games.status);
    const leagueState = useSelector((state) => state.league.status);
    const dispatch = useDispatch();
    let location = useLocation();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const animationTime = { enter: 200, exit: 200};
    let { view } = useParams();
    const season = query.get("season")
    const week = query.get("week")
    const seasonType = query.get("seasonType")
    const currSeason = league.currentSeason
    const currWeek = league.currentWeek 
    const currSeasonType = league.currentSeasonType
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
                <span class="base-color">
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
        if(gamesState === 'idle' && leagueState === 'complete') {
            dispatch(fetchGames({ season: currSeason, seasonType: currSeasonType, week: currWeek, user: user }));
            dispatch(fetchPicks({ season: currSeason, seasonType: currSeasonType, week: currWeek, user: user }));
            dispatch(fetchUserPickData({ season: currSeason, seasonType: currSeasonType, week: currWeek }))
        }
    }, [gamesState, leagueState, currSeason, currWeek, currSeasonType, dispatch, user])

    useEffect(() => {
        if(season && week && seasonType){
            dispatch(fetchGames({ season: season, seasonType: seasonType, week: week, user: user }));
            dispatch(fetchPicks({ season: season, seasonType: seasonType, week: week, user: user }));
            dispatch(fetchUserPickData({ season: season, seasonType: seasonType, week: week }))
        }
    }, [dispatch, user, season, week, seasonType])

    return (
        <>
            <Subscriber topic={WEEK_SHOW_WEEKS}>
                {data => (<>{showWeeks(data)}</>)}
            </Subscriber>
            { spectatorView }
            { gamesTab }
            <div className="games-week-container">
                <div className="week-switcher-container">
                    <WeekSwitcher />
                </div>
                { transitionGroup }
            </div>
            <PickPeekModal />
        </>
    );
}