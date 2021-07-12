import React, { createRef, useEffect, useState } from 'react'
import { routes } from '../../utils/routes';
import { Switch, Route, Redirect } from "react-router-dom";
import { NavBar } from './components/nav-bar/nav-bar';
import { Login } from '../login/login';
import { useSelector } from 'react-redux';
import { Grid, Sticky } from 'semantic-ui-react';
import './home.css';
import { UserStats } from '../../components/user-stats/user-stats';
import { useLocation } from 'react-router-dom';
import { status } from '../../configs/status';

export const Home = () => {   
    const token = useSelector((state) => state.token.status);
    const user = useSelector((state) => state.user.status);
    const contextRef = createRef();
    const [width, setWidth] = useState(window.innerWidth);
    const location = useLocation();

    useEffect(() => {
        const updateWidth = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
    
    if(token === status.IDLE || user === status.IDLE || location.pathname === "/login") {
        return (
            <>
                <Login />
            </>
        )
    }

    const switchContent = (
        <Switch>
            <Redirect exact from="/" to="/games/game"/>
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

    const mobileView = (
        <Grid.Row columns={1} only='mobile tablet'>
            <Grid.Column className="home-content">
                { switchContent }
            </Grid.Column>
        </Grid.Row>
    );

    const stickyStats = (location.pathname !== "/profile") && (location.pathname !== "/login") && (
        <Sticky contextRef={contextRef}>
            <div className="home-side-content">
                <div className="info-header-profile secondary-color">
                    Stats
                </div>
                <UserStats />
            </div>
        </Sticky>
    )

    const largeView = (
        <Grid.Row columns={3}>
            <Grid.Column width={2}>
            </Grid.Column>
            <Grid.Column className="home-content" width={9}>
                { switchContent }
            </Grid.Column>
            <Grid.Column width={5}>
                {stickyStats}
            </Grid.Column>
        </Grid.Row>
    );

    return (
        <div className="home-container">
            <Grid className="home-main" >
                {
                    (width > 1000) ? largeView : mobileView
                }
            </Grid>
            <NavBar />
        </div>
    );
}