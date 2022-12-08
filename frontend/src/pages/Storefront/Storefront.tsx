import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StorefrontItem from "./StorefrontItem";
import placeholder from "./placeholder.jpg";

function Storefront() {
  const { id } = useParams();
  const [store, setStore] = useState({
    name: "Store name",
    location: "Store location",
    description: "Store description",
    items: [
      {
        id: 1,
        name: "Item name A",
        image: placeholder,
        price: 13.37,
        quantity: 7,
      },
      {
        id: 2,
        name: "Item name B",
        image: placeholder,
        price: 2.22,
        quantity: 2,
      },
    ],
  });
  useEffect(() => {
    // TODO: Fetch details for store w/ given id
    return;
  });

  return (
    <div className="storefront-container d-flex flex-column bg-light align-items-center p-5 min-vh-100">
      <div className="storefront-info col-md-11 d-flex flex-column col-12 py-4 align-items-center align-items-sm-start">
        <h2 className="storefront-title fs-1 mb-0">{store.name}</h2>
        <p className="storefront-location fs-6 mb-3 text-secondary">
          {store.location}
        </p>
        <p className="storefront-description fs-6 ">{store.description}</p>
      </div>
      <h3 className="storefront-items-header fs-4 pb-2 col-md-11 d-flex flex-column col-12 align-items-center align-items-sm-start">
        Available Items
      </h3>
      <div className="storefront-items d-flex col-md-11 col-12 flex-row gap-3 flex-wrap justify-content-center justify-content-sm-start">
        {store.items.map(({ id, name, image, price, quantity }) => {
          return (
            <StorefrontItem
              key={id}
              id={id}
              name={name}
              image={image}
              price={price}
              max_quantity={quantity}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Storefront;
