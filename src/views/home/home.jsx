import React from 'react'
import { routes } from '../../utils/routes';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NavBar } from '../../components/nav-bar/nav-bar';

export const Home = () => {     

    return (
        <>
            <Router>
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
            </Router>
            <NavBar />
        </>
    );
}