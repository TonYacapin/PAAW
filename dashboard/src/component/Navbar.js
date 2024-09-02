import React from "react";
import { Navigate } from "react-router-dom";

function Navbar() {
  return (
    <div className="h-14 w-full bg-darkgreen">
      <div className="h-3/6">
        <img src="./pages/assets/PAAW.png" alt="Home" />
      </div>
    </div>
  );
}

export default Navbar;
