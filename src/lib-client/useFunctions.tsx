import { FunctionsService } from "./firebase-services";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "./FirebaseContextProvider";
import { getFunctions } from "firebase/functions";

/**
 * Requires to be rendered within an AppContext.Provider
 * (AKA FirebaseContextProvider)
 */
export default function useStorage() {
  const app = useContext(AppContext);
  const [functions, setFunctions] = useState<FunctionsService | null>(null);

  useEffect(() => {
    if (app) setFunctions(new FunctionsService(getFunctions(app)));
  }, [app]);

  return functions;
}
