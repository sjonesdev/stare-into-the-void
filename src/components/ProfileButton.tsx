"use client";

import { createRef, useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import useCloseOnClickAway from "../hooks/useCloseOnClickAway";

import { AuthContext } from "../lib/auth-context";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Link from "next/link";

export default function ProfileButton() {
  const user = useContext(AuthContext);
  const [showUserOptions, setShowUserOptions] = useState(false);
  const profileDiv = createRef<HTMLDivElement>();
  useCloseOnClickAway(profileDiv, () => setShowUserOptions(false));

  const userIconClass = "hidden block h-6 w-auto lg:block";
  if (user) {
    let icon = <FaUser color="white" className={userIconClass} />;
    if (user.photoURL) {
      icon = (
        <img
          src={user.photoURL}
          className={userIconClass}
          alt={`${user.displayName}`}
        />
      );
    }

    return (
      <div ref={profileDiv}>
        <button
          className={`${
            showUserOptions ? "border-white border-solid" : "border-transparent"
          } border border-2 bg-gray-700 rounded-3xl px-2 py-2 text-white hidden sm:flex flex-no-wrap flex-shrink min-w-0`}
          aria-label={"User options"}
          onClick={() => setShowUserOptions(!showUserOptions)}
        >
          {icon}
        </button>

        <div
          className={`z-10 ${
            showUserOptions ? "visible" : "invisible opacity-0"
          } transition-[visibility,opacity] rounded-md absolute top-16 -right-4 flex flex-col items-center text-white font-md text-gray-300 bg-gray-700 min-w-[8rem]`}
        >
          <p className="w-full text-gray-300 p-2">{user.displayName}</p>
          <span className="w-full max-w-9/10 h-[2px] bg-gray-500 rounded-sm" />
          <button
            className="w-full text-gray-300 hover:text-white hover:bg-gray-800 p-2 text-left"
            onClick={() => firebase.auth().signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <Link
        href={"/signin"}
        aria-label={user ? "Profile" : "Sign In"}
        className="bg-gray-700 rounded-md  px-2 py-2 text-gray-300 hidden sm:flex flex-no-wrap flex-shrink min-w-0"
      >
        Sign In
      </Link>
    );
  }
}
