import React from "react";
import Button from "react-bootstrap/Button";
import "./style.css";

const Items = ({
  items,
  onDelete,
  addQuant,
  minusQuant,
}: {
  items: {
    cart_item_id: number;
    name: string;
    price: number;
    store: string;
    quantity: number;
    imageUrl: string;
  }[];
  onDelete: (id: number) => void;
  addQuant: (id: number) => void;
  minusQuant: (id: number) => void;
}) => {
  return (
    <>
      {items.map((item) => {
        return (
          <div className="cart-item" key={item.cart_item_id}>
            <div className="image-box">
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ height: "200px", width: "200px" }}
              />
            </div>
            <div className="item-info">
              <h1 className="item-name">{item.name}</h1>
              <h3 className="item-price">${item.price}</h3>
              <h3 className="item-store">Store: {item.store}</h3>
            </div>

            <div className="counter">
              <Button
                variant="secondary"
                className="counter-btn"
                onClick={() => minusQuant(item.cart_item_id)}
              >
                -
              </Button>
              <div className="count">Quantity: {item.quantity}</div>
              <Button
                variant="secondary"
                className="counter-btn"
                onClick={() => addQuant(item.cart_item_id)}
              >
                +
              </Button>
            </div>
            <div className="prices">
              <div className="amount">
                $
                {Math.round(
                  (item.quantity * item.price + Number.EPSILON) * 100
                ) / 100}
              </div>
              <Button
                variant="danger"
                onClick={() => onDelete(item.cart_item_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Items;
