import { Login } from './views/login/login';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.scss';

Amplify.configure({...awsconfig, ssr: true});

function App() {
  return (
    <div className="App">
      <Login></Login>
    </div>
  );
}

export default App;
