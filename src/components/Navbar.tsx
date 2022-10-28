import React from "react";
import "./Navbar.css";
import { FaFilter, FaRegEye, FaSearch } from "react-icons/fa";
import { Pages } from "../lib/pages";
import { Link } from "react-router-dom";

function Navbar({ active }: { active: Pages }) {
  const [mobileMenuActive, setMobileMenuActive] = React.useState(false);

  const activeNavLink =
    "bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium";
  const inactiveNavLink =
    "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setMobileMenuActive(!mobileMenuActive)}
            >
              <span className="sr-only">Open main menu</span>
              {/* <!--
                Icon when menu is closed.
    
                Heroicon name: outline/bars-3
    
                Menu open: "hidden", Menu closed: "block"
              --> */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              {/* <!--
                Icon when menu is open.
    
                Heroicon name: outline/x-mark
    
                Menu open: "block", Menu closed: "hidden"
              --> */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <FaRegEye
                  color="white"
                  className="block h-8 w-auto lg:hidden"
                />
              </Link>
              <Link to="/">
                <FaRegEye
                  color="white"
                  className="hidden h-8 w-auto lg:block"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <Link
                  to="/browse"
                  className={
                    active === Pages.Browse ? activeNavLink : inactiveNavLink
                  }
                >
                  Browse
                </Link>

                <Link
                  to="/edit"
                  className={
                    active === Pages.Edit ? activeNavLink : inactiveNavLink
                  }
                >
                  Edit
                </Link>

                <Link
                  to="/recent"
                  className={
                    active === Pages.Recent ? activeNavLink : inactiveNavLink
                  }
                >
                  Recent
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* <!-- Profile dropdown --> */}
            <form className="flex bg-gray-700 rounded-md px-3 py-2 text-white">
              <button type="submit" className="mr-2 text-gray-300">
                <FaSearch />
              </button>
              <input
                type="text"
                className="border-none outline-none bg-gray-700 placeholder-gray-300 text-md front-medium"
                placeholder="Search"
              />
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div
        className={"sm:hidden" + (mobileMenuActive ? "" : " hidden")}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <Link
            to="/browse"
            className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
            aria-current="page"
          >
            Browse
          </Link>

          <Link
            to="/edit"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Edit
          </Link>

          <Link
            to="/recent"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Recent
          </Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
