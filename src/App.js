import './App.css';
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import { Route } from "react-router-dom";

const App = () => {

  return (
    <div>
        <Route exact path ="/"><Login/></Route>
			<Route path ="/home"><Home/></Route>
			<Route path ="/register"><Register/></Route>
    </div>
  );
}

export default App;
