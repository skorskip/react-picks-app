import React from 'react';
import { Home } from './views/home/home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { HashRouter as Router } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchToken } from './controller/token/tokenSlice';
import { PickLoader } from './components/pick-loader/pick-loader';
import './App.scss';
import { useEffect } from 'react';
import { fetchLeague } from './controller/league/leagueSlice';
import { status } from './configs/status';
import { MessagePopup, SnackMessage } from './components/message/messagePopup';
import { ThemeSwitcher } from './components/theme-switcher/theme-switcher';
import { RootState } from './store';
import { publish, PubSub } from './controller/pubSub/pubSubSlice';
import { SHOW_MESSAGE } from './configs/topics';

Amplify.configure({...awsconfig, ssr: true});

function App() {

  const tokenState = useSelector((state: RootState) => state.token.status)
  const userState = useSelector((state: RootState) => state.user.status)
  const leagueState = useSelector((state: RootState) => state.league.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if(userState === status.COMPLETE && 
      tokenState === status.COMPLETE && 
      leagueState === status.IDLE) {

      dispatch(fetchLeague());
    }
  }, [userState, tokenState, dispatch, leagueState]);

  useEffect(() => {dispatch(fetchToken())}, []);

  useEffect(() => {
    if(leagueState === status.ERROR) {
      let request = new PubSub(SHOW_MESSAGE, new SnackMessage(status.ERROR, status.MESSAGE.ERROR_GENERIC));
      dispatch(publish(request))
    }
  }, [leagueState, dispatch])

  if(userState === status.LOADING || 
    leagueState === status.LOADING) {
    return (
      <div className="loader-container">
        <ThemeSwitcher />
        <PickLoader />
      </div>
    )
  }

  return (
    <div className="App">
      <ThemeSwitcher />
      <Router>
        <Home />
        <MessagePopup />
      </Router>
    </div>
  );
}

export default App;
