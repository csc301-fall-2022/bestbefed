import React, { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IMapContext, MapContext } from "./MapContextProvider";

function StoreListItem({ store }: { store: GeoJSON.Feature }) {
  const { curFeature, setCurFeature } = useContext(
    MapContext as React.Context<IMapContext>
  );
  const category = store.properties?.category;
  const distance = store.properties?.distance;

  return (
    <Card
      className="border-0 p-3 rounded-4 my-0"
      onClick={() => {
        setCurFeature(store);
      }}
      style={{
        ...(curFeature === store && { backgroundColor: "rgba(0,0,0,.05)" }),
      }}
    >
      <Card.Body className="p-0">
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <Card.Title className="m-0">{store.properties?.name}</Card.Title>
          <Link
            to={`/store/${store.properties?.id}`}
            state={{
              storeName: store.properties?.name,
              storeLocation: store.properties?.address,
              fromApp: true,
            }}
          >
            <Button
              variant="light"
              className="m-0 rounded-5"
              style={
                {
                  "--bs-btn-padding-y": ".25rem",
                  "--bs-btn-padding-x": ".5rem",
                  "--bs-btn-font-size": ".75rem",
                } as any
              }
            >
              Details
            </Button>
          </Link>
        </div>
        <Card.Subtitle className="mb-2 text-muted">
          {category
            ? `${category[0].toUpperCase() + category.substring(1)} Store`
            : ""}
          {category && distance ? " - " : ""}
          {distance ? `${distance.toFixed(1)} km away` : ""}
        </Card.Subtitle>
        <Card.Text className="mb-0">{store.properties?.address}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default StoreListItem;
