import React, { useState } from "react";
import mapboxgl from "mapbox-gl";
import Map from "./Map";
import FloatingUI from "./FloatingUI";
import "./style.css";

function Home() {
  const [curLocation, setCurLocation] = useState<mapboxgl.LngLat | null>(null);
  return (
    <>
      <FloatingUI curLocation={curLocation} />
      <Map curLocation={curLocation} setCurLocation={setCurLocation} />
    </>
  );
}

export default Home;
