import React, { useState } from "react";
import Data from "./Data";
import Items from "./components/items";
// import Filters from "./components/filters";

const App = () => {
  const [items, setItems] = useState(Data);

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
    console.log(items);
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

  // // helper function for getting distinct values
  // const distinct = (value: any, index: any, self: string | any[]) => {
  //   return self.indexOf(value) === index;
  // };

  // // new array containing all the stores
  // const storeItems = [...Data.map((Val) => Val.store).filter(distinct)];

  // // filter function
  // const filterItem = (curcat: string) => {
  //   const newItem = Data.filter((newVal) => {
  //     return newVal.store === curcat;
  //     // comparing category
  //   });
  //   setItems(newItem);
  // };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <h1 className="col-12 text-center my-3 fw-bold">Your Cart</h1>
          {/* <Filters
            filterItem={filterItem}
            setItems={setItems}
            storeItems={storeItems}
          /> */}
          <Items
            items={items}
            onDelete={deleteItem}
            addQuant={addQuant}
            minusQuant={minusQuant}
          />
        </div>
      </div>
    </>
  );
};

export default App;
