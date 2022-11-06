import React, { useState, useEffect } from "react";
import StoreListItem from "./StoreListItem";
import { Container } from "react-bootstrap";
import axios from "../../api/axios";

const POST_STORE_URL = "/store/stores";
export interface Store {
  name: string;
  category: string;
  distance: number;
  description: string;
}

function StoreList() {
  const [stores, setStores] = useState([]);
  const getStores = async () => {
    const user_loc = {
      location: [12, 13],
    };
    const { data } = await axios.post(
      POST_STORE_URL,
      JSON.stringify(user_loc),
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    setStores(data);
  };

  useEffect(() => {
    getStores();
  }, []);

  return (
    <Container className="flex-grow-1 store-list px-0">
      {stores.map(({ address, store_name, distance, description }) => {
        return (
          <StoreListItem
            name={store_name}
            category={Math.random() < 0.5 ? "Grocery" : "Convenience"}
            distance={distance}
            description={address}
          />
        );
      })}
    </Container>
  );
}

export default StoreList;
