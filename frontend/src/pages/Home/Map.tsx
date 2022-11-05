import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiMWl6YXJkbyIsImEiOiJjbGEzNGRxeTMwbmo4M3BtaHhieDR5MnBrIn0.SOAbn6BE5Qqm86_K5jmECw";

function Map() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLocation, setMapLocation] = useState<mapboxgl.LngLat>(
    new mapboxgl.LngLat(-79.38198, 43.64847)
  );
  let curLocation: mapboxgl.LngLat | null = null;

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      let result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state !== "denied") {
        navigator.geolocation.getCurrentPosition((position) => {
          curLocation = new mapboxgl.LngLat(
            position.coords.longitude,
            position.coords.latitude
          );
          setMapLocation(curLocation);
        });
      }
    }
  };

  // Create map and add data
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: mapLocation,
      zoom: 13,
    });
    map.current.setPadding({
      left: (document.querySelector("#left-panel") as HTMLElement)?.offsetWidth,
      right: 0,
      top: 0,
      bottom: 0,
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
      map.current.panTo(mapLocation);
    }
  }, [mapLocation]);

  return (
    <>
      <div ref={mapContainer} className="map-container" />
      <Button
        variant="dark"
        size="lg"
        className="rounded-circle pe-auto position-absolute foreground bottom-0 end-0 m-3 d-none d-md-inline shadow"
        onClick={fetchLocation}
      >
        <FontAwesomeIcon icon={faLocationCrosshairs} />
      </Button>
    </>
  );
}

export default Map;
