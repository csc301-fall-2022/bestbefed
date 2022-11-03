import React, { Component } from 'react';
import Counter from './counter';

class Item extends Component {
    state = {
        itemName: this.props.itemName,
        price: this.props.price,
        store: this.props.store,
        counter: [{id: 1, value: 0}],
        imageUrl: this.props.imageUrl
     };
    render() { 
        return (
        <div>
            <span className = "boldtext m-2">{this.state.itemName}</span>
            {/* map a counter to the counter component */}
            { this.state.counter.map(counter => 
                <Counter key={counter.id} value={counter.value} selected={true}/> )
            }
            <span className = "m-2">$</span>

        </div>);
    }
}
 
export default Item;