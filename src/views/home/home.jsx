import React, { createRef } from 'react'
import { routes } from '../../utils/routes';
import { Switch, Route } from "react-router-dom";
import { NavBar } from './components/nav-bar/nav-bar';
import { Login } from '../login/login';
import { useSelector } from 'react-redux';
import { selectToken } from '../../controller/token/tokenSlice';
import { Grid, Sticky } from 'semantic-ui-react';
import './home.css';
import { UserStats } from '../../components/user-stats/user-stats';

export const Home = () => {   
    const token = useSelector(selectToken);
    const contextRef = createRef();

    if(token === null) {
        return (
            <Login />
        )
    }

    const switchContent = (
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
    );

    return (
        <div className="home-container">
            <Grid className="home-main" >
                <Grid.Row columns={1} only='mobile tablet'>
                    <Grid.Column className="home-content">
                        { switchContent }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={3} only='computer'>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column className="home-content" width={10}>
                        { switchContent }
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Sticky contextRef={contextRef}>
                            <div className="home-side-content">
                                <div className="info-header-profile secondary-color">
                                    Stats
                                </div>
                                <UserStats />
                            </div>
                        </Sticky>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <NavBar />
        </div>
    );
}