import React from "react";
import Button from "react-bootstrap/Button";

const Items = ({ items, onDelete, addQuant, minusQuant }) => {
  return (
    <>
      <div className="container-fluid">
        <div className="row justify-content-center">
          {items.map((Val) => {
            return (
              <div
                className="col-md-4 col-sm-6 card my-3 py-3 border-0"
                key={Val.id}
              >
                <div className="card-img-top text-center">
                  <img
                    src={Val.imageUrl}
                    alt={Val.itemName}
                    className="photo w-75"
                  />
                </div>
                <div className="card-body">
                  <div className="card-title fw-bold fs-4">
                    {Val.title}: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $
                    {Val.price}
                  </div>
                  <div className="card-text">
                    Store: {Val.store}
                    <Button
                      variant="secondary"
                      onClick={() => minusQuant(Val.id)}
                    >
                      -
                    </Button>
                    Qty: {Val.quantity}
                    <Button
                      variant="secondary"
                      onClick={() => addQuant(Val.id)}
                    >
                      +
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(Val.id)}>
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
