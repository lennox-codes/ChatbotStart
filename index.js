const express = require("express");
const app = express();

// Base Classes
const Order = require("./baseClasses/Order");
const Menu = require("./baseClasses/Menu");

// Menu Items
const ShawarmaOrder = require("./menu/Shawarma");
const PizzaOrder = require("./menu/Pizza");
const SteakOrder = require("./menu/Steak");

const server = require("http").createServer(app);
const io = require("socket.io")(server);
const _ = require("underscore");

require("dotenv").config();

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static("www"));

let oSockets = {};
let oOrders = {};
app.post("/payment/:phone", (req, res) => {
  // this happens when the order is complete
  from = req.params.phone;
  const aReply = oOrders[from].handleInput(req.body);
  const oSocket = oSockets[from];
  // send messages out of turn
  for (let n = 0; n < aReply.length; n++) {
    if (oSocket) {
      const data = {
        message: aReply[n],
      };
      oSocket.emit("receive message", data);
    } else {
      throw new Exception("twilio code would go here");
    }
  }
  //   if (oOrders[from].isDone()) {
  //     delete oOrders[from];
  //     delete oSockets[from];
  //   }
  res.end("ok");
});

app.get("/payment/:phone", (req, res) => {
  // this happens when the user clicks on the link in SMS
  /* Hildred's code
  const sFrom = req.params.phone;
  if (!oOrders.hasOwnProperty(sFrom)) {
    res.end("order already complete");
  } else {
    res.end(oOrders[sFrom].renderForm());
  }
  */

  const sender = req.params.phone;
  if (Order.custId === "") {
    Order.custId = sender;
  } else res.end(Order.renderForm());
});

app.post("/payment", (req, res) =>
  res.end(Order.renderForm(req.body.title, req.body.price))
);

app.post("/sms", (req, res) => {
  let aReply = [];
  const sender = req.body.from;

  // Get the base url
  let sUrl = `${req.headers["x-forwarded-proto"] || req.protocol}://${
    req.headers["x-forwarded-host"] || req.headers.host
  }${req.baseUrl}`;

  const message = req.body.body && req.body.body.toLowerCase();

  if (req.body.clear) {
    return Order.reset();
  }

  if (Order.custId === "") {
    Order.custId = sender;
    Order.senderUrl = sUrl;
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

// app.listen(port, () =>
//   console.log("Example app listening on port " + port + "!")
// );

io.on("connection", function (socket) {
  // when the client emits 'receive message', this listens and executes
  socket.on("receive message", (data) => {
    // set up a socket to send messages to out of turn
    const sFrom = _.escape(data.from);
    oSockets[sFrom] = socket;
  });
});

server.listen(port, function () {
  console.log("Server listening at port %d", port);
});
