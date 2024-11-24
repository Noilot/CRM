import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        padding: "10px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
      }}
    >
      <nav>
        <Link to="/" style={{ marginRight: "15px" }}>
          User List
        </Link>
        <Link to="/orders" style={{ marginRight: "15px" }}>
          Order List
        </Link>
        <Link to="/items" style={{ marginRight: "15px" }}>
          Item List
        </Link>
        <Link to="/stores">Store List</Link>
      </nav>
    </header>
  );
};

export default Header;
