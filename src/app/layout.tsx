import Navbar from "../components/Navbar";
import { Pages } from "../lib-client/pages";
import "./globals.css";
import { Metadata } from "next";
import FirebaseContextProvider from "../lib-client/FirebaseContextProvider";

export const metadata: Metadata = {
  title: "Stare Into the Void",
  description: "NASA image search engine",
};

async function App({ children }: { children: React.ReactNode }) {
  let debugToken;
  if (process.env.NODE_ENV === "development") {
    debugToken = process.env.REACT_APP_CHECK_DEBUG_TOKEN ?? "";
  }
  return (
    <html>
      <body>
        <div className="App">
          <FirebaseContextProvider debugAppCheckToken={debugToken}>
            <Navbar active={Pages.Home} />
            {children}
          </FirebaseContextProvider>
        </div>
      </body>
    </html>
  );
}

export default App;
