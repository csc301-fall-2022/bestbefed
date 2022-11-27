import React, { useState, useEffect } from "react";
import data from "./cart-data.json";
import Items from "./components/Items/Items";
import Filters from "./components/Filters/Filters";
import "./style.css";

function Cart() {
  const [items, setItems] = useState(data); // "all" filter, all the items
  const [filteredItems, setFilteredItems] = useState(data); // filtered version of the items, initial value is what we fetched
  const [filter, setFilter] = useState(); // name of the store that we want to filter for

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const addQuant = (id: number) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = {
          ...item,
          quantity: item.quantity + 1,
        };
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  const minusQuant = (id: number) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        if (item.quantity === 0) {
          return item;
        }
        const updatedItem = {
          ...item,
          quantity: item.quantity - 1,
        };
        return updatedItem;
      }
      return item;
    });
    setItems(newItems);
  };

  // useEffect state for filtering items when the filter state changes
  useEffect(() => {
    // pressed ALL button, 'remove' the filter
    if (filter == null) {
      setFilteredItems(items);
      return;
    }
    // getting all the items that have the correct store
    let newItems = items.filter((item) => {
      return item.store === filter;
    });

    // set the filtered items
    setFilteredItems(newItems);
  }, [items, filter]);

  // filtering
  // helper function for getting distinct values
  const distinct = (value: any, index: any, self: string | any[]) => {
    return self.indexOf(value) === index;
  };

  // new array containing all the stores
  const stores = [...data.map((Val) => Val.store).filter(distinct)];

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="header">
            <h1 className="heading">Your Cart</h1>
          </div>
          <Filters setFilter={setFilter} stores={stores} />
          <Items
            items={filteredItems}
            onDelete={deleteItem}
            addQuant={addQuant}
            minusQuant={minusQuant}
          />
        </div>
      </div>
    </>
  );
}

export default Cart;
