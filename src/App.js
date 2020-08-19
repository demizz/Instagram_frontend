import React, { useEffect, createContext, useContext, useReducer } from "react";
import NavBar from "./components/navBar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import MyFollowingsPosts from "./components/myFollowingsPosts";
import ResetToken from "./components/ResetToken";
import { reducer, initialState } from "./reducer/userReducer";

import "./App.css";
export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      history.push("/");
      dispatch({ type: "USER", payload: user });
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userId">
        <UserProfile />
      </Route>
      <Route path="/myFollowingsPosts">
        <MyFollowingsPosts />
      </Route>
      <Route path="/resetPassword/:token">
        <ResetToken />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
