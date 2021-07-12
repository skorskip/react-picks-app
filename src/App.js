import { Home } from './views/home/home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { BrowserRouter as Router } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchToken } from './controller/token/tokenSlice';
import { PickLoader } from './components/pick-loader/pick-loader';
import './App.scss';
import { useEffect } from 'react';
import { fetchLeague } from './controller/league/leagueSlice';
import { status } from './configs/status';
import { MessagePopup } from './components/message/messagePopup';

Amplify.configure({...awsconfig, ssr: true});

function App() {

  const tokenState = useSelector((state) => state.token.status)
  const userState = useSelector((state) => state.user.status)
  const leagueState = useSelector((state) => state.league.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if(userState === status.COMPLETE && tokenState === status.COMPLETE) {
      dispatch(fetchLeague());
    }
  }, [userState, tokenState, dispatch]);

  useEffect(() => {
    dispatch(fetchToken());
  },[]);

  if(userState === status.LOADING || leagueState === status.LOADING) {
    return (
      <div className="loader-container">
        <PickLoader />
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <Home />
        <MessagePopup />
      </Router>
    </div>
  );
}

export default App;
