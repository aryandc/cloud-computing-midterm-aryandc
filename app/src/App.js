import { useContext, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import "./App.css";
import Login from "./login/Login";
import { AuthContext } from "./context/AuthContext";
import Home from "./home/Home";


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
      </div>
    </Router>
    </>
  );
}
export default App;
