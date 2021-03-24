import { Home } from './views/home/home';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.scss';

Amplify.configure({...awsconfig, ssr: true});

function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
