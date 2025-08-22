import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <Link to="/">Home</Link>&nbsp;&nbsp;&nbsp;
      {!user ? (
        <>
          <Link to="/login">Login</Link>&nbsp;&nbsp;&nbsp;
          <Link to="/register">Register</Link>&nbsp;&nbsp;&nbsp;
        </>
      ) : (
        <>
          <Link to="/tickets">Tickets</Link>&nbsp;&nbsp;&nbsp;
          <Link to="/articles">Articles</Link>&nbsp;&nbsp;&nbsp;
          <Link to="/settings">Settings</Link>&nbsp;&nbsp;&nbsp;
          <button onClick={logout} className="ml-auto bg-red-500 px-2 rounded">
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;
