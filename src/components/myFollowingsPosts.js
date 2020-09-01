import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const MyFollowingsPosts = (props) => {
  const [data, setData] = useState([]);

  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/mySubPost`, {
      headers: {
        //"Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.doc);
      });
  }, []);
  const likePost = (id) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/post/like`, {
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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/post/unlike`, {
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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/post/comment`, {
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
          if (item._id == result.doc._id) {
            return result.doc;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="home">
      {data.map((item, key) => {
        return (
          <div key={item._id} className="card home-card">
            <h5>
              <Link to={"/profile/" + item.postedBy._id}>
                {item.postedBy.name}
              </Link>
            </h5>
            <div className="card-image">
              <img src={item.photo} />
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
              <h6>{item.title} </h6>
              <p>{item.body} </p>
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
};

export default MyFollowingsPosts;
