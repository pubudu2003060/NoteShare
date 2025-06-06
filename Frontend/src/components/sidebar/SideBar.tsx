import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div>
      <div>
        <Link to="/">
          {" "}
          <img src="#" />
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="mygroups">My Groups</Link>
          </li>
          <li>
            <Link to="publicgroups">Public Groups</Link>
          </li>
          <li>
            <Link to="privategroups">Private Groups</Link>
          </li>
          <li>
            <Link to="stared">Stared</Link>
          </li>
        </ul>
      </nav>
      <div>
        <Link to="profile">Profile</Link>
        <Link to="about">About</Link>
      </div>
    </div>
  );
};

export default SideBar;
