import React from "react";
import { Card } from "react-bootstrap";
import { Store } from "./StoreList";

function StoreListItem({ name, category, distance, description }: Store) {
  return (
    <Card className="border-0 pb-3">
      <Card.Body className="p-0">
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {category} Store {distance ? `- ${distance.toFixed(1)} km away` : ""}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <a href="/store/1" className="stretched-link"></a>
      </Card.Body>
    </Card>
  );
}

export default StoreListItem;
