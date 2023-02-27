import React from "react";
import { Toaster } from "react-hot-toast";

import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Fib from "./Fib";
import Other from "./Other";

export default function App() {
  return (
    <div>
      <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
              <Link to="/" className="navbar-brand">
                Fibonaci Finder
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link to="/" className="nav-link">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/other-page" className="nav-link">
                      Other Page
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="container mt-4">
            <div className="card">
              <div className="card-body">
                <Routes>
                  <Route path="/" element={<Fib />} />
                  <Route path="/other-page" element={<Other />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
      <Toaster />
    </div>
  );
}
