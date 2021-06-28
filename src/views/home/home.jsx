import React, { createRef, useEffect, useState } from 'react'
import { routes } from '../../utils/routes';
import { Switch, Route, Redirect } from "react-router-dom";
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
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const updateWidth = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);
    
    if(token === null) {
        console.log("TOKEN NOT SET");
        return (
            <Login />
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

    const largeView = (
        <Grid.Row columns={3}>
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