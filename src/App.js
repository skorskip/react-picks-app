import { Home } from './views/home/home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { BrowserRouter as Router } from "react-router-dom";
import './App.scss';

Amplify.configure({...awsconfig, ssr: true});

function App() {
  return (
    <div className="App">
      <Router>
        <Home />
      </Router>
    </div>
  );
}

export default App;
