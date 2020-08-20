import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

function Home(props) {
  const [data, setData] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/post/home", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);
  const likePost = (id) => {
    fetch("http://127.0.0.1:8000/api/v1/post/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.doc._id) {
            return result.doc;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("http://127.0.0.1:8000/api/v1/post/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.doc._id) {
            return result.doc;
          } else {
            return item;
          }
        });
        setData(newData);
      })

      .catch((err) => console.log(err));
  };
  const makeComment = (text, postId) => {
    fetch("http://127.0.0.1:8000/api/v1/post/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ comment: { text, postId } }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.doc._id) {
            return result.doc;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const deletePost = (postId) => {
    fetch(`http://127.0.0.1:8000/api/v1/post/delete/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          M.toast({ html: result.message, classes: "#43a047 green darken-1" });

          window.location.reload(true);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {data.map((item, key) => {
        return (
          <div key={item._id} className="card home-card">
            <h5>
              <Link
                to={"/profile/" + item.postedBy._id}
                style={{ textTransform: "capitalize" }}
              >
                {item.postedBy.name}
              </Link>
              {item.postedBy._id === state._id ? (
                <i
                  className="material-icons"
                  style={{ float: "right" }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              ) : (
                <i></i>
              )}
            </h5>
            <div className="card-image">
              <img src={item.photo} alt={item.title} />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{ color: "red" }}
                  onClick={() => unlikePost(item._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ color: "red" }}
                  onClick={() => likePost(item._id)}
                >
                  thumb_up
                </i>
              )}

              <h6>{item.likes.length} likes</h6>
              <h6 style={{ textTransform: "capitalize" }}>{item.title} </h6>
              <p style={{ textTransform: "capitalize" }}>{item.body} </p>
              {item.comments.map((comment, key) => {
                return (
                  <h6 key={comment._id}>
                    <span style={{ fontWeight: "500" }}>
                      {comment.postedBy.name} :
                    </span>

                    {comment.text}
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
