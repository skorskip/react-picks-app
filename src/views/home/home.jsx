import React from 'react'
import { routes } from '../../utils/routes';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export const Home = () => {     

    return (
        <Router>
            <Switch>
                {
                    routes.map((route, i) => (
                        <Route
                            key={i}
                            path={route.path}
                            render={props => (
                                <route.component key={i}/>
                            )}
                        />
                    )
                )}
            </Switch>
        </Router>
    );
}