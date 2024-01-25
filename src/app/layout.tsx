"use client";
import Navbar from "../components/Navbar";
import { Pages } from "../lib/pages";
import "./globals.css";
// import AuthContextProvider from "./AuthContextProvider";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Stare Into the Void",
//   description: "NASA image search engine",
// };

function App({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <div className="App">
          <Navbar active={Pages.Home} />
          {children /* <AuthContextProvider>{children}</AuthContextProvider> */}
        </div>
      </body>
    </html>
  );
}

export default App;
