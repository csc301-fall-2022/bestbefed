import React, { Component } from "react";
import Item from "./item";

class Cart extends Component {
  // hardcoded values of items for now, will grab from DB later
  state = {
    items: [
      {
        id: 1,
        itemName: "spaghetti and meatballs",
        price: 11.99,
        store: "food basics",
        count: 0,
        imageUrl: "https://picsum.photos/100",
      },
      {
        id: 2,
        itemName: "apples",
        price: 2.5,
        store: "no frills",
        count: 0,
        imageUrl: "https://picsum.photos/100",
      },
      {
        id: 3,
        itemName: "bread",
        price: 5.0,
        store: "walmart",
        count: 0,
        imageUrl: "https://picsum.photos/100",
      },
      {
        id: 4,
        itemName: "mustard",
        price: 7.4,
        store: "shoppers drug mart",
        count: 0,
        imageUrl: "https://picsum.photos/100",
      },
    ],
  };

  handleDelete = (itemId) => {
    console.log("EH called", itemId);
  };

  render() {
    return (
      <div>
        {/* map the state to every item*/}
        {this.state.items.map((item) => (
          <Item
            key={item.id}
            itemName={item.itemName}
            store={item.store}
            price={item.price}
            count={item.count}
            imageUrl={item.imageUrl}
            onDelete={this.handleDelete}
          />
        ))}
      </div>
    );
  }
}

export default Cart;
