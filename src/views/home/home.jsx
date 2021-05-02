import React from 'react'
import { routes } from '../../utils/routes';
import { BrowserRouter as Router, Switch, Route, useLocation } from "react-router-dom";
import { NavBar } from '../../components/nav-bar/nav-bar';

export const Home = () => {     

    const {pathname} = useLocation();
    const route = (pathname.split("/").length > 0) ? pathname.split("/")[1] : ""

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
            { (route !== "login") && (<NavBar />)}
        </>
    );
}