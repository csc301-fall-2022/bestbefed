import React, { useState, useEffect } from "react";
import Items from "./components/Items/Items";
import Filters from "./components/Filters/Filters";
import "./style.css";
import axios from "../../api/axios";

interface CartItem {
  cart_item_id: number;
  name: string;
  store: string;
  quantity: number;
  price: number;
  inventory_item: number;
  imageUrl: string;
}

function Cart() {
  const [total, setTotal] = useState<number>(0); // "all" filter, all the items
  const [items, setItems] = useState<CartItem[]>([]); // "all" filter, all the items
  const [filteredItems, setFilteredItems] = useState<CartItem[]>([]); // filtered version of the items, initial value is what we fetched

  useEffect(() => {
    const getCartData = async () => {
      const data = await axios.get(GET_CART_URL, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setTotal(data.data.pop());
      // TODO remove the place holder image
      data.data.map((item: CartItem) => {
        item.imageUrl = "https://via.placeholder.com/150";
      });
      setItems(data.data);
      setFilteredItems(data.data);
    };
    getCartData();
  }, []);

  const [filter, setFilter] = useState(); // name of the store that we want to filter for

  const GET_CART_URL = "/user/items";
  var fetchUpdateUrl = (cartItemId: Number) => `/user/items/${cartItemId}`;
  var fetchDeleteUrl = (cartItemId: Number, clearAll: Boolean) =>
    `/user/items/${cartItemId}/${clearAll}`;

  const deleteItem = async (id: number) => {
    var newTotal: number = 0;
    setItems(
      items
        .map((item) => {
          if (item.cart_item_id === id) {
            newTotal = total - item.price * item.quantity;
            setTotal(newTotal);
          }
          return item;
        })
        .filter((item) => item.cart_item_id !== id)
    );
    await axios.delete(fetchDeleteUrl(id, false), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  };

  const deleteAll = async () => {
    setItems([]);
    await axios.delete(fetchDeleteUrl(0, true), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    setTotal(0);
  };

  const addQuant = async (id: number) => {
    var quantity = 0;
    const newItems = items.map((item) => {
      if (item.cart_item_id === id) {
        quantity = item.quantity + 1;
        const updatedItem = {
          ...item,
          quantity: quantity,
        };
        setTotal(total + item.price);
        return updatedItem;
      }
      return item;
    });

    const request_data = {
      quantity: quantity,
    };
    await axios.patch(fetchUpdateUrl(id), JSON.stringify(request_data), {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    setItems(newItems);
  };

  const minusQuant = async (id: number) => {
    var quantity = 0;
    const newItems = items.map((item) => {
      if (item.cart_item_id === id) {
        quantity = item.quantity - 1;
        if (item.quantity <= 1) {
          return item;
        }
        const updatedItem = {
          ...item,
          quantity: quantity,
        };
        setTotal(total - item.price);
        return updatedItem;
      }
      return item;
    });
    if (quantity >= 1) {
      const request_data = {
        quantity: quantity,
      };
      await axios.patch(fetchUpdateUrl(id), JSON.stringify(request_data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    }
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
  const stores = [...items.map((Val) => Val.store).filter(distinct)];

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
          <button>total: {total}</button>
          <button onClick={deleteAll}>Clear Cart</button>
        </div>
      </div>
    </>
  );
}

export default Cart;
