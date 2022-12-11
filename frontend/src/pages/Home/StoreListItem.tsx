import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Store } from "./StoreList";

function StoreListItem({ id, name, category, distance, description }: Store) {
  return (
    <Card className="border-0 pb-3">
      <Card.Body className="p-0">
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {category} Store {distance ? `- ${distance.toFixed(1)} km away` : ""}
        </Card.Subtitle>
        <Card.Text>{description}</Card.Text>
        <Link
          to={`/store/${id}`}
          state={{ storeName: name, storeLocation: description, fromApp: true }}
          className="stretched-link"
        />
      </Card.Body>
    </Card>
  );
}

export default StoreListItem;
