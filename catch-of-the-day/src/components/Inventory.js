import React from "react";
import AddFishForm from "./AddFishForm";
import firebase from "firebase";
import PropTypes from 'prop-types';
import base, {firebaseApp} from "../base"

class Inventory extends React.Component{
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.renderSignin = this.renderSignin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logout = this.logout.bind(this);
        this.handleChange = this.handleChange.bind(this);

        /**
         * set the initial state of the user here
         * initial values must be null
         */ 
        this.state = {
            uId: null,
            owner: null
        }
    }

    /**
     * set up the state of inventory if there is a user logged in
     * using the lifecycle hooks 
     */
    componentDidMount() {
        firebase.auth().onAuthStateChanged( user => {
            console.log("checking to see if there is a user: ", user);
            if(user) {
                console.log("what is the user: ", {user});
                this.authHandler({user});
            }
        })
    }

    /**
     * 
     * @param {String} provider - the identity of the user to authenticat
     */
    authenticate(provider) {
        console.log("trying to log in with the provider: ", provider);

        /**
         * format provider to match requirements from firebase
         */
        const formattedProvider = (provider[0].toUpperCase() + provider.slice(1));
        console.log("serviceProvider: ", formattedProvider);
        /**
         * calling the authentication service specific to the provider that was selected 
         * byt the user - example "github" changed to "Github"
         * `${formattedProvider}AuthProvider` = "GithubAuthProvider" as an example
         */
        const authProvider = new firebase.auth[`${formattedProvider}AuthProvider`]();
        console.log("serviceProvider info: ", authProvider);

        /**
         * authenticate user against infromation in firebase
         */
        firebase
            .auth()
            .signInWithPopup(authProvider)
            .then(this.authHandler);

    }

    async authHandler(data) {

        // look up the current store in the database
        const store = await base.fetch(this.props.storeId,{context: this});

        // create a user Id based on info from data
        const userId = data.user.uid

        // claim it if there isn't an owner
        if(!store.owner) {
            // post the logged in user to the database if not claimed
            await base.post(`${this.props.storeId}/owner`, {data: userId});
        }

        // update the state of the inventory with the current user
        this.setState({
            uId: userId,
            owner: store.owner || userId
        })
    }    
 
    // method to log a user out
    async logout() {
        console.log("we want to log out at this point");
        await firebase.auth().signOut();

        // update the state again
        this.setState({uId: null, owner: null});
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        
        /**
         * take a copy of that fish and update with new data
         * [e.target.name]: e.target.value is a computed value to update 
         * only the values that have changed in an object
         */
        const updatedFish = {
            ...fish,
            [e.target.name]: e.target.value
        }

        // update the state of the fishes in the app level
        this.props.updateFish(key, updatedFish);        
    }

    /**
     * create a method that will render the 3 differe
     * ways that an admin could sign into the app
     */ 
    renderSignin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sing in to manage your store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}>Log in with Twitter</button>
            </nav>
        )
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className="fish-edit" key={key}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)}/>
                <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>
                <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
                    <option value="available">Fresh!</option>
                    <option value="unavailable">Sold out!</option>
                </select>
                <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
                <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    render() {
        const logout = <button className="logOut" onClick={this.logout}>Log out</button>;
        // check if the user is not logged in
        if(!this.state.uId) {
            return (
                <div>{this.renderSignin()}</div>
            )
        }

        // check to see if the user is the owner of the store
        if(this.state.owner !== this.state.uId) {
            return (
                <div>
                    <p>Sorry - you aren't the owner of this store</p>
                    {logout}
                </div>
            )
        }
        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                { Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes: PropTypes.object.isRequired,
    addFish: PropTypes.func.isRequired,
    removeFish:PropTypes.func.isRequired,
    updateFish: PropTypes.func.isRequired,
    loadSamples: PropTypes.func.isRequired,
    storeId: PropTypes.string.isRequired,
}
export default Inventory;