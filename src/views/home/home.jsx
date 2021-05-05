import React, { useEffect } from 'react'
import { routes } from '../../utils/routes';
import { Switch, Route, useLocation } from "react-router-dom";
import { NavBar } from '../../components/nav-bar/nav-bar';
import { PickLoader } from '../../components/pick-loader/pick-loader';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeague } from '../../controller/league/leagueSlice';
import { Login } from '../login/login';
import AmplifyAuth from '../../utils/amplifyAuth'

export const Home = () => {     

    const leagueState = useSelector((state) => state.league.status);
    const userState = useSelector((state) => state.user.status);
    const dispatch = useDispatch();
    const {pathname} = useLocation();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : "";

    useEffect(() => {
        if(userState === 'complete') {
            dispatch(fetchLeague());
        }
    }, [userState, dispatch]);

    if(!AmplifyAuth.TokenIsValid()) {
        return (
            <Login />
        )
    }

    if(userState === 'loading' || leagueState === 'loading') {
        return (
            <PickLoader />
        )
    }

    return (
        <>
            <Switch>
                {
                    routes.map((route, i) => (
                        <Route
                            key={i}
                            path={route.path}
                            render={props => (
                                <route.component 
                                    key={i} 
                                    routes={route.routes}
                                />
                            )}
                        />
                    )
                )}
            </Switch>
            { (route !== "login" && route !== "") && (<NavBar />)}
        </>
    );
}