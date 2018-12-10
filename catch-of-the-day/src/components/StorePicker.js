import React from "react";
import PropTypes from "prop-types"
import { getFunName } from "../helpers";
import {Redirect} from "react-router-dom";

class StorePicker extends React.Component{
    constructor(props) {
        super(props);
        // constructor is the only place to set state directly
        this.state = {
            hasId: false,
            location: ""
        };
    }
    
    goToStore(event) {
        event.preventDefault();

        if(this.storeInput.value !== "" || this.storeInput.value !== undefined) {
            this.setState({
                hasId: true,
                location: "/store/"+this.storeInput.value
            });
        }
    }

    render() {
        { /* transisiton to "/store/{{storeId}}"" from "/" only if there is a hasId true value in state */ }
        if(this.state.hasId) {
            console.log("looking for state again: ", this.state);
            { /* use the Redirect component from reat-router-dom to do the navigation
                use ${} to pass some values from logic into components
            */ }
            return ( <Redirect to={this.state.location} /> )
        }
        
        return(
            <form className="store-secector" onSubmit={this.goToStore.bind(this)}>
                { /* this is how you comment in jsx 
                    you can only return one parent element in the render function
                    comments count as an element!
                 */}
                <h2>Please Enter a store</h2>
                <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input)=>{this.storeInput = input}} />
                <button type="submit">Visit Store</button>
            </form>
        )
    }

    componentDidMount() {}

}

StorePicker.contextTypes = {
    router: PropTypes.object
}

export default StorePicker;