import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-app.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.24.0/firebase-database.js";
// Your web app's Firebase configuration
import firebaseConfig from "./firebase.js";

const saveOrder = (order) => {
  const orderId = new Date().toISOString().replace(".", "_");
  firebase
    .database()
    .ref("orders/" + orderId)
    .set(order)
    .then(() => {
      alert("Order Saved");
      window.open("", "_self");
      window.close();
    })
    .catch((err) => {
      console.log(err.toString());
    });
};
