import React, { useRef, useEffect, useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationCrosshairs } from "@fortawesome/free-solid-svg-icons";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl, { GeoJSONSource, Marker } from "mapbox-gl";
import { IMapContext, MapContext } from "./MapContextProvider";
mapboxgl.accessToken =
  "pk.eyJ1IjoiMWl6YXJkbyIsImEiOiJjbGEzNGRxeTMwbmo4M3BtaHhieDR5MnBrIn0.SOAbn6BE5Qqm86_K5jmECw";

function Map() {
  const { mapLocation, setMapLocation, curFeature, stores, getStores } =
    useContext(MapContext as React.Context<IMapContext>);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [curLocation, setCurLocation] = useState<mapboxgl.LngLat | null>();
  const [droppin] = useState(
    new Marker({
      color: "limegreen",
      scale: 0.85,
    })
  );

  const fetchLocation = async () => {
    if (navigator.geolocation) {
      let result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state !== "denied") {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurLocation(
            new mapboxgl.LngLat(
              position.coords.longitude,
              position.coords.latitude
            )
          );
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
    map.current.on("load", () => {
      map.current?.setPadding({
        left: (document.querySelector("#left-panel") as HTMLElement)
          ?.offsetWidth,
        right: 0,
        top: 0,
        bottom: 0,
      });
      let f = async () => {
        await getStores();
      };
      f();
      map.current?.addSource("stores", { type: "geojson", data: stores });
      map.current?.addLayer({
        id: "stores",
        type: "circle",
        source: "stores",
        paint: {
          "circle-radius": 6,
          "circle-color": "limegreen",
          "circle-stroke-width": 2,
          "circle-stroke-color": "white",
        },
      });
      if (map.current) droppin.addTo(map.current);
      map.current?.on("click", (e) => {
        setMapLocation(e.lngLat);
      });
    });
  }, []);

  // Update map location when we get a new current location
  useEffect(() => {
    if (curLocation) setMapLocation(curLocation);
  }, [curLocation]);

  // Update layer when store data changes
  useEffect(() => {
    let source = map.current?.getSource("stores") as GeoJSONSource;
    if (source) {
      source.setData(stores);
    }
  }, [stores]);

  // Zoom to feature when we get a new feature
  useEffect(() => {
    if (curFeature)
      map.current?.flyTo({
        center: (curFeature.geometry as GeoJSON.Point).coordinates as [
          number,
          number
        ],
        zoom: 17,
      });
  }, [curFeature]);

  // Update map center and nearby stores any time lng/lat changes
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({ center: mapLocation, zoom: 14 });
      droppin.remove();
      droppin.setLngLat(mapLocation);
      droppin.addTo(map.current);
    }
    getStores();
  }, [mapLocation, droppin]);

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
