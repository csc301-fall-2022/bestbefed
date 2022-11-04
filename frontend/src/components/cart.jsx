import React, { Component } from "react";
import Item from "./item";
import Button from "react-bootstrap/esm/Button";
import styles from "./cart.module.css";

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
  // handler for increase button
  handleIncrease = (item) => {
    // clone the array of items in our state
    const items = [...this.state.items];
    const index = items.indexOf(item);
    items[index] = { ...item };
    items[index].count++;
    this.setState({ items });
  };
  // handler for decrease button
  handleDecrease = (item) => {
    // clone the array of items in our state
    if (item.count > 0) {
      const items = [...this.state.items];
      const index = items.indexOf(item);
      items[index] = { ...item };
      items[index].count--;
      this.setState({ items });
    }
  };
  // handler for All button
  handleAll = () => {
    const items = this.state.items;
    this.setState({ items });
  };
  handleDelete = (itemId) => {
    // get all the items that don't have the id of the item that we are removing
    const items = this.state.items.filter((i) => i.id !== itemId);
    this.setState({ items });
  };

  render() {
    return (
      <div>
        {/* map the state to every item*/}
        <div className={styles.items}>
          {this.state.items.map((item) => (
            <Item
              key={item.id}
              item={item}
              onDelete={this.handleDelete}
              onIncrease={this.handleIncrease}
              onDecrease={this.handleDecrease}
            />
          ))}
        </div>

        {/* create some buttons on the right side of the screen that filter (we need to have 1 button for each store in the DB) */}
        <div className={styles.filters}>
          <Button variant="secondary" className="m-2" onClick={this.handleAll}>
            All
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={this.handleFBFilter}
          >
            food basics
          </Button>
          <Button
            variant="secondary"
            className="m-2"
            onClick={this.handleNFFilter}
          >
            no frills
          </Button>
          <Button variant="secondary" className="m-2">
            walmart
          </Button>
          <Button variant="secondary" className="m-2">
            shoppers drug mart
          </Button>
        </div>
      </div>
    );
  }
}

export default Cart;
