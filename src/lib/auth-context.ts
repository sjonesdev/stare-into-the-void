"use client";

import { createContext } from "react";
import type firebase from "firebase/compat/app";

type UserType = firebase.User | null | undefined;

const AuthContext = createContext<UserType>(null);

export { type UserType, AuthContext };
