import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { fetchPicks, selectPicksIds } from '../../controller/picks/picksSlice';
import { Switch, Route, useLocation, useParams } from "react-router-dom";
import { GamesTabBar } from './components/games-tab-bar/games-tab-bar';
import { PickLoader } from '../../components/pick-loader/pick-loader';
import {  TransitionGroup, CSSTransition } from 'react-transition-group';
import "./games.css";
import "./slideTransition.scss";

export const Games = ({routes}) => {
    const user = useSelector(selectUser);
    const gameLoadStatus = useSelector((state) => state.games.status);
    const userState = useSelector((state) => state.user.status);
    const pickIds = useSelector(selectPicksIds);
    const dispatch = useDispatch();
    let location = useLocation();
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const animationTime = { enter: 200, exit: 200};
    let { view } = useParams();

    useEffect(() => {
        if(userState === 'complete') {
            dispatch(fetchGames({ season: '2020', seasonType: '2', week: '6', user: user }));
            dispatch(fetchPicks({ season: '2020', seasonType: '2', week: '6', user: user }));
        }
    }, [userState, dispatch, user]);

    if(userState === 'loading') {
        return (
            <PickLoader />
        )
    }

    return (
        <>
            <GamesTabBar pickCount={pickIds.length}/>
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
        </>
    );
}