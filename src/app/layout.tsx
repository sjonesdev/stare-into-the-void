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
  return (
    <html>
      <body>
        <div className="App">
          <FirebaseContextProvider>
            <Navbar active={Pages.Home} />
            {children}
          </FirebaseContextProvider>
        </div>
      </body>
    </html>
  );
}

export default App;
