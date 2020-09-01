import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams, useHistory } from "react-router-dom";

function UserProfile(props) {
  const [Profile, setProfile] = useState(null);
  const [showFollow, setShowFollow] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const followUser = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/follow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followers: result.data.doc.followers,
            followings: result.data.doc.followings,
          },
        });

        setShowFollow(false);
      })
      .catch((err) => console.log(err));
  };
  const unfollowUser = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/unfollow`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ userId }),
    })
      .then((res) => res.json())
      .then((result) => {
        dispatch({
          type: "UPDATE",
          payload: {
            followers: result.data.doc.followers,
            followings: result.data.doc.followings,
          },
        });

        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {Profile ? (
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
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={Profile.user.photo}
              />
            </div>
            <div>
              <h4 style={{ textTransform: "capitalize" }}>
                {Profile.user.name}
              </h4>
              <h5>{Profile.user.email}</h5>
              {showFollow ? (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => followUser()}
                >
                  follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-1"
                  onClick={() => unfollowUser()}
                >
                  unfollow
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h5>{Profile.userPosts.length} posts </h5>
                <h5>{state.followers.length} followers </h5>
                <h5> {state.followings.length}following </h5>
              </div>
            </div>
          </div>
          <div className="gallery">
            {Profile.userPosts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...</h2>
      )}
    </>
  );
}

export default UserProfile;
