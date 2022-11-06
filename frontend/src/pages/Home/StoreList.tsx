import React from "react";
import StoreListItem from "./StoreListItem";
import { Container } from "react-bootstrap";
import { loremIpsum } from "lorem-ipsum";

export interface Store {
  name: string;
  category: string;
  distance: number;
  description: string;
}

function StoreList() {
  let stores: Array<Store> = [];
  for (let i = 0; i < 8; i++) {
    stores.push({
      name: "Test Store " + (i + 1),
      category: ["Grocery", "Convenience"][Math.floor(Math.random() * 2)],
      distance: Math.random() * 10,
      description: loremIpsum(),
    });
  }

  return (
    <Container className="flex-grow-1 store-list px-0">
      {stores.map(({ name, category, distance, description }) => {
        return (
          <StoreListItem
            name={name}
            category={category}
            distance={distance}
            description={description}
          />
        );
      })}
    </Container>
  );
}

export default StoreList;
