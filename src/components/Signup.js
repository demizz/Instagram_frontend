import { Link, useHistory } from "react-router-dom";
import React, { useState, useContext, useEffect } from "react";
import M from "materialize-css";
import { UserContext } from "../App";

function Signup(props) {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      postFields();
    }
  }, [url]);
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", photo);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "de8wrgyph");
    fetch("https://api.cloudinary.com/v1_1/de8wrgyph/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.secure_url);
      })
      .catch((err) => console.log(err));
  };
  const postFields = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        password,
        email,
        photo: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "fail") {
          M.toast({
            html: data.message.message,
            classes: "#c62828 red darken-3",
          });
        } else if (data.status === "success") {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });

          M.toast({ html: data.message, classes: "#43a047 green darken-1" });
          history.push("/home");
        }
      });
  };
  const postData = () => {
    if (photo) {
      uploadImage();
    } else {
      postFields();
    }
  };

  return (
    <div>
      <div className="mycard">
        <div className="card auth-card">
          <h2>Instagram</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <div className="file-field input-field">
            <div className="btn">
              <span>Upload Image</span>
              <input
                type="file"
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                }}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>

          <button
            className="btn waves-effect waves-light #64b5f6 blue lighten-2"
            onClick={() => postData()}
          >
            Signup
          </button>
          <h5>
            <Link to="/login">Already to have an account ?</Link>
          </h5>
        </div>
      </div>
    </div>
  );
}

export default Signup;
