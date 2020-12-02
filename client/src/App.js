import './App.css';
import { UserProvider } from './utils/UserState';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import User from './pages/User';

function App() {
  return (
    <Router>
      {/* Providing the ability to access the state across the entire application */}
      <UserProvider>
        {/* Declaring the Navbar outside the switch so it shows on all pages */}
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/user" component={User} />
        </Switch>
      </UserProvider>
    </Router>
  );
}

export default App;
