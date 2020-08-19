import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import M from "materialize-css";

function ResetToken(props) {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const postData = () => {
    fetch(`http://127.0.0.1:8000/resetPassword/${token}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password,
        confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "fail") {
          M.toast({ html: result.message, classes: "#c62828 red darken-3" });
        } else if (result.status === "success") {
          M.toast({ html: result.message, classes: "#43a047 green darken-1" });

          history.push("/login"); //window.setTimeout(()=>{location.assign('/')},1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => postData()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ResetToken;
