import React, { useState, useEffect } from "react";
import StoreListItem from "./StoreListItem";
import { Container } from "react-bootstrap";
import { loremIpsum } from "lorem-ipsum";
import axios from "../../api/axios";
import { setSyntheticTrailingComments } from "typescript";

const GET_STORE_URL = "/store/stores";
export interface Store {
  name: string;
  category: string;
  distance: number;
  description: string;
}

function StoreList() {
  const [stores, setStores] = useState([]);
  const getStores = async () => {
    const res = await axios.get(GET_STORE_URL, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    const p = res.data;
    setStores(p);
    console.log(res);
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
            category={"category"}
            distance={12}
            description={address}
          />
        );
      })}
    </Container>
  );
}

export default StoreList;
