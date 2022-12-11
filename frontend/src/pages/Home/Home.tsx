import React from "react";
import Map from "./Map";
import FloatingUI from "./FloatingUI";
import "./style.css";
import MapContextProvider from "./MapContextProvider";

function Home() {
  return (
    <MapContextProvider>
      <FloatingUI />
      <Map />
    </MapContextProvider>
  );
}

export default Home;
