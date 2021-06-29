import "https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.12/js/framework7.bundle.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js";
// Your web app's Firebase configuration
import firebaseConfig from "./firebase.js";

//initialize framework 7
var myApp = new Framework7();

// If your using custom DOM library, then save it to $$ variable
var $$ = Dom7;

// Add the view
myApp.view.create(".view-main", {
  // enable the dynamic navbar for this view:
  dynamicNavbar: true,
});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase
  .database()
  .ref("orders/")
  .on("value", (snapshot) => {
    $$("#order_list").html("");
    let orders = snapshot.val();
    console.log(orders);
    Object.keys(orders).map((key) => {
      const order = orders[key];
      console.log(order);
      $$("#order_list").prepend(`<div>${order.payer.email_address}</div>`);
    });
  });
