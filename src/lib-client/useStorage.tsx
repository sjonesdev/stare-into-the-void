import { StorageService } from "./firebase-services";
import { useContext, useEffect, useState } from "react";
import { getStorage } from "firebase/storage";
import { AppContext } from "./FirebaseContextProvider";

/**
 * Requires to be rendered within an AppContext.Provider
 * (AKA FirebaseContextProvider)
 */
export default function useStorage() {
  const app = useContext(AppContext);
  const [storage, setStorage] = useState<StorageService | null>(null);

  useEffect(() => {
    if (app) setStorage(new StorageService(getStorage(app)));
  }, [app]);

  return storage;
}
