import { Link, useHistory } from "react-router-dom";
import React, { useState, useContext } from "react";
import M from "materialize-css";
import { UserContext } from "../App";

function Login(props) {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const postData = () => {
    fetch("http://127.0.0.1:8000/api/v1/user/login", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          M.toast({ html: data.message, classes: "#c62828 red darken-3" });
        } else if (data.status === "success") {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });

          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          history.push("/home"); //window.setTimeout(()=>{location.assign('/')},1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const forgotPassword = () => {
    fetch("http://127.0.0.1:8000/api/v1/user/forgot-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          M.toast({ html: result.message, classes: "#43a047 green darken-1" });
        } else if (result.status === "fail") {
          M.toast({ html: result.message, classes: "#c62828 red darken-3" });
        }
      })

      .catch((err) => console.log(err));
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <h6 onClick={() => forgotPassword()} className="forgotpassword">
          forgot password ?
        </h6>

        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => postData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}

export default Login;
