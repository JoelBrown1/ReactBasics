// let's go!
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, 
        Route, 
        Switch
    } from "react-router-dom";

/**
 * this is for global css rules
 * you'd want to contain other more specific css rules to each component
 */
import "./css/style.css";

/**
 * components created in different files but used here
 */
import App from "./components/app";
import StorePicker from "./components/StorePicker";
import NotFound from "./components/NotFound";


/**
 * routers information setup
 */
const Root = () => {
    return (
        <BrowserRouter>
            
            <Switch>
                { /*<Match exactly pattern="/" component={StorePicker}/>  - this "doesn't seem" to work*/}
                
                <Route exact={true} path="/" component={StorePicker} /> { /* exact match to the "index" */}
                <Route path="/store/:storeId" component={App} /> { /* match to any store identified */}
                <Route component={NotFound} /> { /* component rendered when nothing matches */}
            </Switch>
        </BrowserRouter>
    )
}

render(<Root/>, document.querySelector("#main"));