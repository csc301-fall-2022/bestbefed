import React, { Component } from 'react';

class Counter extends Component {
    state = { 
        count: this.props.value
    };


    // increase handler
    handleIncrease = () => {
        this.setState({ count: this.state.count + 1 });
    }
     
    render() {

        return (
            <div>
                <span className="m-2">Qty: {this.state.count}</span>
                <button onClick={this.handleIncrease} className="btn btn-secondary btn-sm">+</button>
            </div>
        )
    }
}
 
export default Counter;