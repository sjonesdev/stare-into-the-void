import { useContext } from "react";
import { AuthContext } from "../../lib/firebase-services";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export default function Profile() {
  const user = useContext(AuthContext);
  const navigate = useNavigate();
  if (!user) {
    navigate("/signin");
    return (
      <div className="bg-grey-700">
        <h2 className="text-white text-xl 3xl:text-3xl 3xl:p-4 text-center">
          Not Signed In
        </h2>
      </div>
    );
  }

  return (
    <div className="xl:py-12 3xl:py-24 mx-auto">
      <div className="w-full xl:w-10/12 bg-charcoal bg-opacity-80 xl:rounded-xl max-h-max mx-auto p-4 xl:p-8">
        <h2 className="text-white text-xl 3xl:text-3xl 3xl:p-4 text-center">
          <span className="font-bold">{user.displayName}</span>
        </h2>
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName ?? "User"} />
        ) : (
          <FaUser color="white" className="h-24 w-24 mx-auto" />
        )}
      </div>
    </div>
  );
}
