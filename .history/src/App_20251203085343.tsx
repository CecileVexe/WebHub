import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ZoomCard } from "./components/animFlow/zoomCard";
import Main from "./components/animFlow/main";

function App() {
  return (
    <>
      <Main />
      <ZoomCard />
    </>
  );
}

export default App;
