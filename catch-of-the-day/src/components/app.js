import React from "react";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import sampleFishes from "../sample-fishes";
import Fish from "./fish";

import base from "../base";

import PropTypes from 'prop-types';

class App extends React.Component {
    constructor(props) {
        super();
        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.removeFish = this.removeFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.state = {
            fishes: {},
            order: {}
        }
    }

    /**
     * looking into shouldComponentUpdate to remove a double render
     * something strange is happening here
     
    shouldComponentUpdate( nextProps, nextState ) {
        console.log({nextProps, nextState});
        console.log("should the component rerender: ", nextState.order == this.state.order);
        return nextState.order == this.state.order;
    }
    */

    componentWillMount() {
        /**
         * this runs right before the <APP> is rendered
         */
        const storeId = this.props.match.params.storeId;
        this.ref = base.syncState(`${storeId}/fishes`,
        {
            context: this,
            state: "fishes"
        });

        /**
         * check to see if there is any order data in localStorage
         */
        const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);
        if(localStorageRef) {
           // update our APP component's order state
            this.setState({
                order: JSON.parse(localStorageRef)
            })
        }
        console.log("data in app: ", this.props);
    }

    componentwillUnmount() {
        base.removeBinding(this.ref);
    }

    UNSAFE_componentWillUpdate(nextProps, nextState) {
        // console.log({nextProps, nextState});
        localStorage.setItem(`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order))
    }

    addFish(fish) {
        console.log("adding the fish: ", fish);
        // update state
        const fishes = { ...this.state.fishes};
        // add in the new fish
        const timeStanp = Date.now();
        fishes[`fish-${timeStanp}`] = fish;
        // set state
        this.setState({fishes});
        // is the same as this.setState({fishes: fishes});
    }

    updateFish(key, updatedFish) {
        const fishes = { ...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({fishes});
    }

    removeFish(key) {
        const fishes = { ...this.state.fishes};
        fishes[key] = null;
        this.setState({fishes});
    }

    loadSamples() {
        console.log("loading the sample fish - what is this: ", this);
        this.setState({
            fishes: sampleFishes
        });
    }

    addToOrder(key) {
        // take a copy of the state
        // ... is a ES6 spreader operator to help make a compy of an obj amongst other things
        const order = {...this.state.order};
        // update or add new fish
        order[key] = order[key]+1 || 1;
        this.setState({order: order});
    }

    removeFromOrder(key) {
        const order = {...this.state.order};
        // remove fish from order
        delete order[key];
        this.setState({order: order});
    }

    render() {
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                        {
                            Object.keys(this.state.fishes)
                            .map((fish) => {
                               return (
                                /* key isn't accessible to the component */
                                    <Fish 
                                        key={fish}
                                        index={fish}
                                        details={this.state.fishes[fish]} 
                                        addToOrder={this.addToOrder}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order}
                    removeFromOrder={this.removeFromOrder}
                    storeId={this.props.match.params.storeId}
                />
                <Inventory 
                    addFish={this.addFish} 
                    loadSamples={this.loadSamples}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    fishes={this.state.fishes}
                    storeId={this.props.match.params.storeId}
                />
            </div>
        )
    }
}

App.propTypes ={
    match: PropTypes.object.isRequired
}

export default App;