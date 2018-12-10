import Rebase from "re-base";
import firebase from "firebase"

/**
 * Wes Bos tutorial suggest doing it this way
 * didn't work - maybe because I'm using the cloud firestore 
 * instead of the realtime database?
 * 
 * this might pose an issue - we'll see
const base = Rebase.createClass({
    apiKey: "AIzaSyCpqxoFFRKoU3VmFfqlqyC1TfI76ENVzpM",
    authDomain: "catch-of-the-day-d2ead.firebaseapp.com",
    databaseURL: "https://catch-of-the-day-d2ead.firebaseio.com",
});
*/

/**
 * found this at:
 * https://stackoverflow.com/questions/48435161/error-integrating-firebase-into-react-app
 * seems to work with the regular firebase database
 * (switched becase the other database option was more difficult to configure - sopmething to figure out)
 */
const config = {
    apiKey: "AIzaSyBZDVM-fkOZxR8rjURjxDnTLFr6160Wiag",
    authDomain: "awesomeproject2-b1f28.firebaseapp.com",
    databaseURL: "https://awesomeproject2-b1f28.firebaseio.com",
}

const firebaseApp = firebase.initializeApp(config);
const base = Rebase.createClass(firebaseApp.database());

/**
 * exporting a named element
 * used specifically in Inventory.js
 * for checking/authenticating the user
 */
export {firebaseApp};

// this is the default export
export default base;