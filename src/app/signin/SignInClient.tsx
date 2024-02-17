"use client";

import { useContext, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { LuLoader2 } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { AuthContext } from "../FirebaseContextProvider";

export default function SignInClient() {
  const [signingUp, setSigningUp] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const router = useRouter();
  const user = useContext(AuthContext);

  if (user) {
    router.push("/");
  }

  const formControlClasses =
    "bg-gray-700 rounded-md px-3 py-2 text-white text-gray-300 p-2 rounded-md";
  const inputClasses = formControlClasses + " w-full";

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    setLoading(true);

    if (signingUp) {
      try {
        if (!name) throw new Error("Please enter a name");
        await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser == null) {
          throw new Error("Failed to create user. Please try again.");
        }
        await updateProfile(auth.currentUser, { displayName: name });
        console.debug("Signed up");
      } catch (e) {
        console.error("Sign up failed", e);
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.debug("Signed in");
      } catch (e) {
        console.error("Sign in failed", e);
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-[20rem] bg-gray-800 text-gray-300 mx-auto my-8 px-8 py-6 rounded-2xl">
      <div
        className={`flex gap-2 mb-4 ${
          signingUp && "flex-row-reverse justify-end"
        }`}
      >
        <h2 className="text-white text-xl underline">
          {signingUp ? "Sign Up" : "Sign In"}
        </h2>
        <button
          className="hover:underline text-xl"
          onClick={() => setSigningUp(!signingUp)}
        >
          {signingUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
      <form className="flex flex-col gap-4">
        <label>
          Email
          <input
            className={inputClasses}
            type="email"
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </label>
        {signingUp && (
          <label>
            Name
            <input
              className={inputClasses}
              type="text"
              onChange={(ev) => setName(ev.target.value)}
            />
          </label>
        )}
        <label>
          Password
          <input
            className={inputClasses}
            type="password"
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </label>
        {error && <div className="text-red-500">{error}</div>}
        <button
          className={`${formControlClasses} max-w-fit mx-auto mt-2`}
          type="submit"
          onClick={submit}
        >
          {loading ? (
            <LuLoader2 className="animate-spin" />
          ) : signingUp ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}
