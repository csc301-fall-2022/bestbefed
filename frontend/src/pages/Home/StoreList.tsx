import React, { useState, useEffect } from "react";
import StoreListItem from "./StoreListItem";
import { Container } from "react-bootstrap";
import axios from "../../api/axios";

const POST_STORE_URL = "/store/stores";
export interface Store {
  id: string;
  name: string;
  category: string;
  distance: number | null;
  description: string;
}

function StoreList({
  query,
  curLocation,
}: {
  query: string;
  curLocation: mapboxgl.LngLat | null;
}) {
  const [stores, setStores] = useState([]);
  const [noneFound, setNoneFound] = useState(false);

  const getStores = async () => {
    axios
      .get(POST_STORE_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        params: {
          storeName: query,
          ...(curLocation && { location: curLocation.toArray() }),
        },
      })
      .then((response) => {
        setStores(response.data);
        setNoneFound(false);
      })
      .catch((err) => {
        console.error("Unable to fetch stores");
        setNoneFound(true);
      });
  };

  useEffect(() => {
    getStores();
  }, [query, curLocation]);

  if (noneFound || stores.length === 0) {
    return (
      <Container className="d-flex flex-grow-1 store-list px-0 align-items-center justify-content-center">
        <div className="fs-5 fst-italic text-secondary">No stores found</div>
      </Container>
    );
  }
  return (
    <Container className="flex-grow-1 store-list px-0 pt-3">
      {stores.map(({ id, address, storeName, distance, description }, i) => {
        return (
          <StoreListItem
            id={id}
            name={storeName}
            category="Grocery"
            distance={curLocation ? distance : null}
            description={address}
            key={id}
          />
        );
      })}
    </Container>
  );
}

export default StoreList;
