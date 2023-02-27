import React from "react";
import { Link } from "react-router-dom";

export default function Other() {
  return (
    <div>
      <h4>Other Page</h4>
      <p>This is another page</p>
      <Link to="/">Go to main page</Link>
    </div>
  );
}
