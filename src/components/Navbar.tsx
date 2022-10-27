import React from "react";
import "./Navbar.css";
import { FaFilter, FaFontAwesome, FaRegEye, FaSearch } from "react-icons/fa";

function Navbar() {
    return <div className="Navbar">
        <div className="navbar-wrapper">
            <div className="left-side">
                <div className="logo">
                    <FaRegEye color="white" size={80} />
                </div>
                <div className="nav-link-wrapper">
                    <a href="./App.tsx">Home</a>
                </div>
                <div className="nav-link-wrapper">
                    Recents
                </div>
            </div>
            <div className="right-side">
                <div className="nav-link-wrapper">
                    <FaFilter />
                </div>
                <div className="nav-link-wrapper">
                    <div className="search-wrapper">
                        <input className="search-box" type="text" placeholder="Search"></input>
                        <button type="submit" className="search-button">
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}
export default Navbar;