import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button";
import ListGroup from "react-bootstrap/ListGroup";

class Item extends Component {
  render() {
    return (
      <div>
        {/* putting the item in a bootstrap card */}
        <Card style={{ width: "100%", height: "10%" }}>
          <Card.Img variant="bottom" src={this.props.item.imageUrl} />
          <Card.Body>
            <Card.Title>{this.props.item.itemName}</Card.Title>
          </Card.Body>
          <ListGroup className="list-group-flush">
            <ListGroup.Item>Store: {this.props.item.store}</ListGroup.Item>
            <ListGroup.Item>Qty: {this.props.item.count}</ListGroup.Item>
          </ListGroup>
          <Card.Body>
            {/* increase button */}
            <Button
              onClick={() => this.props.onIncrease(this.props.item)}
              variant="secondary"
              size="sm"
              className="m-2"
            >
              +
            </Button>
            {/* decrease button */}
            <Button
              onClick={() => this.props.onDecrease(this.props.item)}
              variant="secondary"
              size="sm"
              className="m-2"
            >
              -
            </Button>
            {/* delete button */}
            <Button
              onClick={() => this.props.onDelete(this.props.item.id)}
              variant="danger"
              size="sm"
              style={{ float: "right" }}
              className="m-2"
            >
              Delete
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Item;
