import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";

function Profile(props) {
  const [profile, setprofile] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [photo, setPhoto] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (photo) {
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

          fetch("http://127.0.0.1:8000/api/v1/user/updatePhoto", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ photo: data.secure_url }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log("the results is now", result.data.doc.photo);
              dispatch({ type: "UPLOAD", payload: result.data.doc.photo });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  }, [photo]);
  const uploadPhoto = (file) => {
    setPhoto(file);
  };

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/user/myProfile", {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setprofile(result.doc);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state.photo}
          />
        </div>
        <div>
          <h4 style={{ textTransform: "capitalize" }}>{state.name}</h4>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h5>{profile.length} posts </h5>
            <h5>{state.followers.length}followers </h5>
            <h5> {state.followings.length} following </h5>
          </div>
        </div>
      </div>
      <div className="file-field input-field">
        <div className="btn">
          <span>Upload Image</span>
          <input
            type="file"
            onChange={(e) => {
              uploadPhoto(e.target.files[0]);
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>

      <div className="gallery">
        {profile.map((item, key) => {
          return <img className="item" key={item._id} src={item.photo} />;
        })}
      </div>
    </div>
  );
}

export default Profile;
