import React from "react";
import { useRef } from "react";
import { Button } from "react-bootstrap";
import "./style.css";

function StorefrontItem({
  name,
  id,
  image,
  price,
  max_quantity,
}: {
  name: string;
  id: number;
  image: string;
  price: number;
  max_quantity: number;
}) {
  let quantity = useRef<HTMLInputElement>(null);

  function handleAdd() {
    // TODO: Implement adding to cart
    return;
  }

  return (
    <div
      className="item-card-container d-flex flex-column gap-1 shadow p-2 rounded-3 bg-white text-break"
      style={{ width: "225px" }}
    >
      <div className="item-image-container rounded-2 p-1 overflow-hidden">
        <img
          src={image}
          alt="Item"
          style={{
            width: "100%",
            height: "10em",
            objectFit: "cover",
          }}
        />
      </div>
      <h3 className="item-title mb-0 fs-4 d-inline-block px-1">{name}</h3>
      <div className="item-details px-1">
        <div className="item-price fw-light fs-6">${price.toFixed(2)}</div>
        {/* TODO: Add item measurements and price per unit */}
      </div>
      <div className="item-interactions d-flex flex-row justify-content-end mt-1 gap-2 p-1">
        <input
          className="item-quantity"
          defaultValue="1"
          ref={quantity}
          onKeyDown={(e) => {
            if (e.key !== "Tab") {
              e.preventDefault();
            }
          }}
          type="number"
          min="1"
          max={max_quantity}
        ></input>
        <Button className="add-item-to-cart mt-0 rounded-5" variant="dark">
          Add +
        </Button>
      </div>
    </div>
  );
}

export default StorefrontItem;
