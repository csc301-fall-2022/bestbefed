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
    id: number;
    itemName: string;
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
          <div className="cart-item" key={item.id}>
            <div className="image-box">
              <img
                src={item.imageUrl}
                alt={item.itemName}
                style={{ height: "200px", width: "200px" }}
              />
            </div>
            <div className="item-info">
              <h1 className="item-name">{item.itemName}</h1>
              <h3 className="item-price">${item.price}</h3>
              <h3 className="item-store">Store: {item.store}</h3>
            </div>

            <div className="counter">
              <Button
                variant="secondary"
                className="counter-btn"
                onClick={() => minusQuant(item.id)}
              >
                -
              </Button>
              <div className="count">Quantity: {item.quantity}</div>
              <Button
                variant="secondary"
                className="counter-btn"
                onClick={() => addQuant(item.id)}
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
              <Button variant="danger" onClick={() => onDelete(item.id)}>
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
