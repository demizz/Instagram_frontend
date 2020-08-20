import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Allposts(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/post/", {})
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
      });
  }, []);

  return (
    <div className="home">
      {data.map((item, key) => {
        return (
          <div key={item._id} className="card home-card">
            <h5>{item.postedBy.name}</h5>
            <div className="card-image">
              <img src={item.photo} alt={item.title} />
            </div>

            <h6>{item.likes.length} likes</h6>
            <h6>{item.title} </h6>
            <p>{item.body} </p>
          </div>
        );
      })}
    </div>
  );
}

export default Allposts;
