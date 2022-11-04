import React, { Component } from "react";

class Item extends Component {
  state = {
    itemName: this.props.itemName,
    price: this.props.price,
    store: this.props.store,
    count: this.props.count,
    imageUrl: this.props.imageUrl,
  };

  handleIncrease = () => {
    this.setState({ count: this.state.count + 1 });
  };

  handleDecrease = () => {
    if (this.state.count > 0) {
      this.setState({ count: this.state.count - 1 });
    }
  };
  render() {
    return (
      <div>
        <img src={this.state.imageUrl}></img>
        <span className="boldtext m-2">{this.state.itemName}</span>
        <span className="m-2">Store: {this.state.store}</span>
        <span className="m-2">Qty: {this.state.count}</span>
        {/* increase button */}
        <button
          onClick={this.handleIncrease}
          className="btn btn-secondary btn-sm m-2"
        >
          +
        </button>
        {/* decrease button */}
        <button
          onClick={this.handleDecrease}
          className="btn btn-secondary btn-sm m-2"
        >
          -
        </button>

        {/* delete button */}
        <button
          onClick={() => this.props.onDelete(this.props.id)}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
        <span className="m-2">${this.state.price}</span>
      </div>
    );
  }
}

export default Item;
