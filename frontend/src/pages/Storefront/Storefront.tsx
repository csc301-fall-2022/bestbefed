import React, { useState, useEffect } from "react";
import { useLocation, useParams, Navigate } from "react-router-dom";
import StorefrontItem from "./StorefrontItem";
import axios from "../../api/axios";

export interface Item {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
}

function Storefront() {
  const { id } = useParams();
  const location = useLocation();
  const { storeName, storeLocation, fromApp } = location.state;

  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios
      .get("/store/items", {
        params: {
          storeId: id,
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  }, [id]);

  if (!fromApp) {
    // User got here from URL, not from clicking link
    // I made it this way because we currently don't have a way of
    // getting the store name from its ID
    // TODO: Find a better solution!
    return <Navigate to="/" replace />;
  }

  return (
    <div className="storefront-container d-flex flex-column bg-light align-items-center p-5 min-vh-100">
      <div className="storefront-info col-md-11 d-flex flex-column col-12 py-4 align-items-center align-items-sm-start">
        <h2 className="storefront-title fs-1 mb-0">{storeName}</h2>
        <p className="storefront-location fs-6 mb-3 text-secondary">
          {storeLocation}
        </p>
      </div>

      {items.length > 0 ? (
        <>
          <h3 className="storefront-items-header fs-4 pb-2 col-md-11 d-flex flex-column col-12 align-items-center align-items-sm-start">
            Available Items
          </h3>
          <div className="storefront-items d-flex col-md-11 col-12 flex-row gap-3 flex-wrap justify-content-center justify-content-sm-start">
            {items.map(({ itemId, name, price, quantity }: Item) => {
              return (
                <StorefrontItem
                  key={itemId}
                  itemId={itemId}
                  name={name}
                  // image={image}
                  price={price}
                  quantity={quantity}
                />
              );
            })}
          </div>
        </>
      ) : (
        <h3 className="storefront-items-header fs-4 pb-2 col-md-11 d-flex flex-column col-12 align-items-center align-items-sm-start">
          No Items Found
        </h3>
      )}
    </div>
  );
}

export default Storefront;
