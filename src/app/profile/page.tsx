"use client";

import { useContext } from "react";
import { AuthContext } from "../../lib-client/auth-context";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

export default function Profile() {
  const user = useContext(AuthContext);
  const router = useRouter();
  if (!user) {
    router.push("/signin");
    return <></>;
  }

  return (
    <div className="xl:py-12 3xl:py-24 mx-auto">
      <div className="w-full xl:w-10/12 bg-charcoal bg-opacity-80 xl:rounded-xl max-h-max mx-auto p-4 xl:p-8">
        <h2 className="text-white text-xl 3xl:text-3xl 3xl:p-4 text-center">
          <span className="font-bold">{user.displayName}</span>
        </h2>
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName ?? "User"}
            width={100}
            height={100}
          />
        ) : (
          <FaUser color="white" className="h-24 w-24 mx-auto" />
        )}
      </div>
    </div>
  );
}
