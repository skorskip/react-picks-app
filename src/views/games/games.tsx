import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { selectPicksIds, fetchPicks } from '../../controller/picks/picksSlice';
import { fetchGames, getSetWeek } from '../../controller/games/gamesSlice';
import { selectLeague } from '../../controller/league/leagueSlice';
import { Switch, Route, useLocation, useParams, useHistory } from "react-router-dom";
import { GamesTabBar } from './components/games-tab-bar/games-tab-bar';
import { WeekSwitcher } from './components/week-switcher/week-switcher';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Icon } from 'semantic-ui-react';
import { WEEK_SHOW_WEEKS, SHOW_MESSAGE } from '../../configs/topics';
import "./games.css";
import "../../utils/slideTransition.scss";
import { fetchUserPickData } from '../../controller/user-pick-data/userPickDataSlice';
import { PickPeekModal } from '../../components/pick-peek-modal/pick-peek-modal';
import { status } from '../../configs/status';
import { UserTypeEnum } from '../../model/user/user';
import { useSwipeable } from 'react-swipeable';
import { RootState } from '../../store';
import { SeasonRequest } from '../../model/postRequests/seasonRequest';
import { publish, PubSub, subscribe } from '../../controller/pubSub/pubSubSlice';
import { SnackMessage } from '../../components/message/messagePopup';
import { toInt } from '../../utils/tools';

interface RouteParams {
    view: string
}

type Props = {
    routes: {path: string, component: any}[] | undefined
}

export const Games = ({routes}: Props) => {
    const user = useSelector(selectUser);
    const league = useSelector(selectLeague);
    const pickIds = useSelector(selectPicksIds);
    const gamesState = useSelector((state: RootState) => state.games.status);
    const leagueState = useSelector((state: RootState) => state.league.status);
    const picksState = useSelector((state:RootState) => state.picks.status);
    const userPickDataState = useSelector((state: RootState) => state.userPickData.status);
    const setWeek = useSelector(getSetWeek);
    const sub = useSelector(subscribe);
    const dispatch = useDispatch();

    let location = useLocation();
    let history = useHistory();
    const animationTime = { enter: 200, exit: 200};
    let param = useParams<RouteParams>();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const season = toInt(query.get("season"));
    const week = toInt(query.get("week"));
    const seasonType = toInt(query.get("seasonType"))
    const other = query.get("user");

    const currSeason = league.currentSeason
    const currWeek = league.currentWeek 
    const currSeasonType = league.currentSeasonType
    const [weeksShown, setWeeksShown] = useState(false);

    const swipeView = (view: string) => {
        if(season === null) {
            history.push(`/games/${view}`);
        } else {
            history.push(`/games/${view}?season=${season}&seasonType=${seasonType}&week=${week}`);
        }
    }

    const swipeHandlers = useSwipeable({
        onSwipedRight: () => swipeView('game'),
        onSwipedLeft: () => swipeView('pick'),
        delta : 100,
    });


    const spectatorView = (user.type !== UserTypeEnum.PARTICIPANT) && (
        <div className="header-container">
            <div className="spectator-container warn-background">
                <div className="base-color spectator-icon">
                    <Icon name="binoculars" />
                </div>
                <span className="base-color">
                    Spectator Mode
                </span>
            </div>
        </div>
    );

    const gamesTab = (user.type === UserTypeEnum.PARTICIPANT && (other === null || other === "null")) && (
        <GamesTabBar pickCount={pickIds.length}/>
    )

    const transitionGroup = (!weeksShown) && (
        <TransitionGroup component="div" className="route-container">
            <CSSTransition 
                key={param.view} 
                timeout={animationTime} 
                classNames="pageSlider" 
                mountOnEnter={false} 
                unmountOnExit={true}>
                <div className={param.view === "pick" ? "left" : "right"}>
                    <Switch location={location}>
                        {(routes) && routes.map((route, i) =>(
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

        if(gamesState === status.IDLE && leagueState === status.COMPLETE) {
            let request = new SeasonRequest(currSeason, currSeasonType, currWeek);
            dispatch(fetchGames(request));
            dispatch(fetchUserPickData(request));
            dispatch(fetchPicks(request));
        }

    }, [gamesState, leagueState, currSeason, currWeek, currSeasonType, week, dispatch])

    useEffect(() => {

        if((season && week && seasonType) && week !== setWeek) {
            let request = new SeasonRequest(season, seasonType, week);
            dispatch(fetchGames(request));
            dispatch(fetchUserPickData(request));
            dispatch(fetchPicks(request));
        }

    }, [season, week, seasonType, other, setWeek, dispatch])

    useEffect(() => {

        if(gamesState === status.ERROR 
            || picksState === status.ERROR
            || userPickDataState === status.ERROR){
                
            let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
            dispatch(publish(request));
        }

    }, [gamesState, dispatch, picksState, userPickDataState]);

    useEffect(() => {
        if(sub.topic === WEEK_SHOW_WEEKS) {
            setWeeksShown(sub.data);
        }
    }, [sub, dispatch])

    return (
        <div {...swipeHandlers} style={{ touchAction: 'pan-y' }}>
            { spectatorView }
            { gamesTab }
            <div className="games-week-container">
                <div className="week-switcher-container">
                    <WeekSwitcher />
                </div>
                { transitionGroup }
            </div>
            <PickPeekModal />
        </div>
    );
}