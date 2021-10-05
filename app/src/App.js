import { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import Login from "./login/Login";
import { AuthContext } from "./context/AuthContext";
import Home from "./home/Home";
import Homepage from "./testUI/homepage";


function App() {
  const [cognitoUser, setCognitoUser] = useContext(AuthContext);

  useEffect(() => {
    console.log(cognitoUser);
  }, [cognitoUser]);

  return (
    <>
    <Router>
      <div>
        <Route path="/" exact component={cognitoUser === null ? Login : Home} />
        <Route path="/test" exact component={cognitoUser === null ? Login : Homepage} />
      </div>
    </Router>
    </>
  );
}
export default App;
