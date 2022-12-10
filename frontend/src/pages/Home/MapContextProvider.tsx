import mapboxgl, { LngLat } from "mapbox-gl";
import React, { ReactNode, useEffect, useState } from "react";
import axios from "../../api/axios";

export interface IMapContext {
  mapLocation: mapboxgl.LngLat;
  setMapLocation: (location: mapboxgl.LngLat) => void;
  stores: GeoJSON.FeatureCollection;
  getStores: () => void;
  setStores: (stores: GeoJSON.FeatureCollection) => void;
  curFeature: GeoJSON.Feature | null;
  setCurFeature: (feature: GeoJSON.Feature | null) => void;
  query: string;
  setQuery: (query: string) => void;
}

export const MapContext = React.createContext<IMapContext | null>(null);

const POST_STORE_URL = "/store/stores";

function MapContextProvider({ children }: { children: ReactNode }) {
  const [mapLocation, setMapLocation] = useState<mapboxgl.LngLat>(
    new LngLat(-79.3896317, 43.6425701)
  );
  const [stores, setStores] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });
  const [curFeature, setCurFeature] = useState<GeoJSON.Feature | null>(null);
  const [query, setQuery] = useState("");

  const getStores = () => {
    let features: GeoJSON.Feature[] = [];
    axios
      .get(POST_STORE_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        params: {
          storeName: query,
          ...(mapLocation && {
            location: JSON.stringify([mapLocation.lng, mapLocation.lat]),
          }),
        },
      })
      .then((response) => {
        for (const store of response.data) {
          features.push({
            type: "Feature",
            geometry: store.location as GeoJSON.Geometry,
            properties: {
              id: store.id,
              name: store.storeName,
              address: store.address,
              distance: store.distance || null,
              type: store.type || null,
            },
          });
        }
        setStores({ type: "FeatureCollection", features: features });
      })
      .catch((err) => {
        console.error("Unable to fetch stores");
      });
  };

  return (
    <MapContext.Provider
      value={{
        mapLocation,
        setMapLocation,
        stores,
        getStores,
        setStores,
        curFeature,
        setCurFeature,
        query,
        setQuery,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export default MapContextProvider;
