const express = require("express");
const app = express();
const Order = require("./baseClasses/Order");
const Menu = require("./baseClasses/Menu");

const ShawarmaOrder = require("./menu/Shawarma");
const PizzaOrder = require("./menu/Pizza");
const SteakOrder = require("./menu/Steak");

// Bodyparser
app.use(express.json());
app.use(express.urlencoded());

// Static folder
app.use(express.static("www"));

app.get("/users/:uname", (req, res) => {
  res.end("Hello " + req.params.uname);
});

app.post("/sms", (req, res) => {
  let aReply = [];
  const sender = req.body.from;
  const message = req.body.body && req.body.body.toLowerCase();

  if (req.body.clear) {
    return Order.reset();
  }

  if (Order.custId !== "") {
    Order.custId = sender;
  }

  switch (Order.state) {
    case "welcoming":
      Order.state = "selecting";
      const welcomeMessage = !Order.items.length
        ? "Welcome to Richard's Shawarma."
        : "";
      const askOrder = "What would you like to order?";
      aReply.push(welcomeMessage, askOrder, Menu.listItems());
      break;

    case "selecting":
      if (Menu.hasItem(message)) {
        Order.state = "adding";
        if (message === "shawarma") {
          Order.addItem(new ShawarmaOrder());
        } else if (message === "pizza") {
          Order.addItem(new PizzaOrder());
        } else if (message === "steak") {
          Order.addItem(new SteakOrder());
        }
        takeOrder();
      } else aReply.push("Please make sure your selection is on the menu!");
      break;

    case "adding":
      takeOrder();
      break;

    case "finished":
      aReply = Order.getSummary();
      break;
  }

  function takeOrder() {
    const item = Order.items[Order.items.length - 1];
    aReply = item.handleInput(message);
  }

  res.setHeader("content-type", "text/xml");
  let sResponse = "<Response>";
  for (let i = 0; i < aReply.length; i++) {
    sResponse += "<Message>";
    sResponse += aReply[i];
    sResponse += "</Message>";
  }
  res.end(sResponse + "</Response>");
});

let port = process.env.PORT || parseInt(process.argv.pop()) || 3002;

app.listen(port, () =>
  console.log("Example app listening on port " + port + "!")
);
