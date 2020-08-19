import React, { useContext, useRef, useEffect, useState } from "react";
import "./navBar.css";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [usersDetails, setusersDetails] = useState([]);
  const searchModal = useRef(null);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const RenderList = () => {
    useEffect(() => {
      M.Modal.init(searchModal.current);
    }, []);
    if (state) {
      return [
        <li
          key="0"
          data-target="modal1"
          className="large material-icons modal-trigger"
          style={{ color: "black" }}
        >
          search
        </li>,
        <li key="1">
          <Link to="/profile">My profile</Link>
        </li>,
        <li key="2">
          <Link to="/myFollowingsPosts">My followings posts</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create new Post </Link>
        </li>,
        ,
        <button
          className="btn #c62828 red-darken-3"
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            history.push("/login");
          }}
        >
          Logout
        </button>,
      ];
    } else {
      return [
        <li key="5">
          <Link to="/login">login</Link>
        </li>,
        <li key="6">
          <Link to="/signup">signup</Link>
        </li>,
      ];
    }
  };
  const fetchusers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setusersDetails(result.users);
      })
      .catch((err) => console.log(err));
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to="/" className="brand-logo left">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {RenderList()};
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchusers(e.target.value)}
          />
          <ul className="collection">
            {usersDetails.map((item, key) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                >
                  <li
                    className="collection-item"
                    key={item._id}
                    onClick={() =>
                      M.Modal.getInstance(searchModal.current).close()
                    }
                  >
                    {item.email}
                  </li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={(e) => setSearch("")}
          >
            close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
