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
  const logout = () => {
    fetch("http://127.0.0.1:8000/api/v1/user/logout", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.log(err));
    localStorage.clear();
    dispatch({ type: "CLEAR" });
    history.push("/");
  };
  const renderLogo = () => {
    if (state) {
      return (
        <Link to="/home" className="brand-logo left">
          Instagram
        </Link>
      );
    } else {
      return (
        <Link to="/" className="brand-logo left">
          Instagram
        </Link>
      );
    }
  };
  const fetchusers = (query) => {
    setSearch(query);

    fetch("http://127.0.0.1:8000/api/v1/user/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
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
          style={{
            color: "black",
            marginTop: "20px",
            marginRight: "20px",
            cursor: "pointer",
          }}
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
        <button className="btn #c62828 red-darken-3" onClick={() => logout()}>
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

  return (
    <nav>
      <div className="nav-wrapper white">
        {renderLogo()};
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
                  key={item._id}
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
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
