import React from "react";
import Button from "react-bootstrap/Button";

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
      <div className="container-fluid">
        <div className="row justify-content-center">
          {items.map((item) => {
            return (
              <div
                className="col-md-4 col-sm-6 card my-3 py-3 border-0"
                key={item.id}
              >
                <div className="card-img-top text-center">
                  <img
                    src={item.imageUrl}
                    alt={item.itemName}
                    className="photo w-75"
                  />
                </div>
                <div className="card-body">
                  <div className="card-title fw-bold fs-4">
                    {item.itemName}: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $
                    {item.price}
                  </div>
                  <div className="card-text">
                    Store: {item.store}
                    <Button
                      variant="secondary"
                      onClick={() => minusQuant(item.id)}
                    >
                      -
                    </Button>
                    Qty: {item.quantity}
                    <Button
                      variant="secondary"
                      onClick={() => addQuant(item.id)}
                    >
                      +
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Items;
