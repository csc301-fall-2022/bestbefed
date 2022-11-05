import React, { useRef, useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiMWl6YXJkbyIsImEiOiJjbGEzNGRxeTMwbmo4M3BtaHhieDR5MnBrIn0.SOAbn6BE5Qqm86_K5jmECw";

function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-79.4);
  const [lat, setLat] = useState(43.64);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state !== "denied") {
            navigator.geolocation.getCurrentPosition((position) => {
              setLng(position.coords.longitude);
              setLat(position.coords.latitude);
            });
          }
        });
    }
  });

  // Create map and add data
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng as number, lat as number],
      zoom: 12,
    });

    fetch(
      "https://api.mapbox.com/datasets/v1/1izardo/cla31ywhh0u9z20s0473wmllm/features?access_token=pk.eyJ1IjoiMWl6YXJkbyIsImEiOiJjbDhua2RkMmIwdHlxM29veWJpY2RjMDc5In0.IRH-PqrKFzsYsPjb2SAVEQ"
    )
      .then((response) => response.json())
      .then((data) => {
        map.current?.addLayer({
          id: "stores",
          type: "circle",
          paint: {
            "circle-color": "limegreen",
            "circle-radius": 10,
          },
          source: {
            type: "geojson",
            data: data,
          },
        });
      });
  });

  // Update map center any time lng/lat changes
  useEffect(() => {
    if (map.current) {
      map.current.setCenter(new mapboxgl.LngLat(lng as number, lat as number));
    }
  }, [lng, lat]);

  return <div ref={mapContainer} className="map-container" />;
}

export default Map;
