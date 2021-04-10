import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../controller/user/userSlice';
import { fetchGames } from '../../controller/games/gamesSlice';
import { fetchPicks, selectPicksIds } from '../../controller/picks/picksSlice';
import { Switch, Route, useLocation } from "react-router-dom";
import { GamesTabBar } from './components/games-tab-bar/games-tab-bar';
import "./games.css";

export const Games = ({routes}) => {
    const user = useSelector(selectUser);
    const userState = useSelector((state) => state.user.status);
    const pickIds = useSelector(selectPicksIds);
    const dispatch = useDispatch();

    let { search } = useLocation();
    const query = new URLSearchParams(search);

    useEffect(() => {
        if(userState === 'complete') {
            dispatch(fetchGames({ season: '2020', seasonType: '2', week: '6', user: user }));
            dispatch(fetchPicks({ season: '2020', seasonType: '2', week: '6', user: user }));
        }
    }, [userState, dispatch, user]);

    return (
        <>
            <GamesTabBar pickCount={pickIds.length}/>
            <div className="route-container">
                <Switch>
                    {routes.map((route, i) =>(
                        <Route
                            key={i}
                            path={route.path}
                            render={props => (<route.component key={i} />)}
                        />
                    ))}
                </Switch>
            </div>
        </>
    );
}