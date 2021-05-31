import React from 'react'
import { routes } from '../../utils/routes';
import { Switch, Route } from "react-router-dom";
import { NavBar } from './components/nav-bar/nav-bar';
import { Login } from '../login/login';
import { useSelector } from 'react-redux';
import { selectToken } from '../../controller/token/tokenSlice';

export const Home = () => {   
    const token = useSelector(selectToken);  

    if(token === null) {
        return (
            <Login />
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
            <NavBar />
        </>
    );
}