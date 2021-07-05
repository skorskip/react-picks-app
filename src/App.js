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

Amplify.configure({...awsconfig, ssr: true});

function App() {

  const tokenState = useSelector((state) => state.token.status)
  const userState = useSelector((state) => state.user.status)
  const leagueState = useSelector((state) => state.league.status);
  const dispatch = useDispatch();

  useEffect(() => {
    if(userState === 'complete' && tokenState === 'complete') {
      dispatch(fetchLeague());
    }
  }, [userState, tokenState, dispatch]);

  useEffect(() => {
    dispatch(fetchToken());
  },[]);

  if(userState === 'loading' || leagueState === 'loading') {
    return (
      <PickLoader />
    )
  }

  return (
    <div className="App">
      <Router>
        <Home />
      </Router>
    </div>
  );
}

export default App;
