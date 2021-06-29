class Order {
  constructor() {
    this.custPhone = "";
    this.senderUrl;
    this.state = "welcoming";
    this.custId = "";
    this.items = [];
    this.states = ["welcoming", "selecting", "adding", "finished"];
    this.total = 0;
    this.testPrice = 0;

    if (Order._instance) {
      return Order._instance;
    }
    Order._instance = this;
  }

  reset() {
    this.state = "welcoming";
    this.items = [];
    this.custId = "";
    this.total = 0;
  }

  addItem(item) {
    this.items.push(item);
  }

  formatPrice(price) {
    return "$" + price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  }

  getSummary() {
    this.getTotal();
    // Set the date
    let date = new Date();
    date.setMinutes(date.getMinutes() + 20);
    const timeToPickUp = `Pick up at ${date.toLocaleTimeString("en-US")}`;

    // get payment url
    //  const paymentUrl = `<a href="${this.sUrl}/payment/${this.custId}">${this.sUrl}/payment/${this.custId}<a>  `;

    const paymentUrl = `<a class="link" href="${this.senderUrl}/payment/${this.custId}/">here</a>`;

    // create messages to send
    let orderSummary = ["Here are your order item(s): "];
    this.items.forEach((item, index) => {
      orderSummary.push(
        `${index + 1}) ${item.description} \nPrice: ${this.formatPrice(
          item.finalPrice
        )}`
      );
    });

    orderSummary.push(
      `The estimated total of your order is ${this.formatPrice(this.total)}`,
      timeToPickUp
    );

    orderSummary.push("Make your payment " + paymentUrl);
    return orderSummary;
  }

  getTotal() {
    this.items.forEach((item) => (this.total += item.finalPrice));
    return this.total;
  }

  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sAmount != "-1") {
      this.testPrice = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID;
    return `
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
      </head>
      
      <body class="container" style="margin-top: 100px">
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?&client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>

        <h3>Thank you ${this.custId} for your order of $${this.total}.</h3>
        <div id="paypal-button-container"></div>
        <script src="/js/order.js" type="module"></script>
        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.total}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                     details.order = ${JSON.stringify(this)}
                     saveOrder(details)
                      window.open("", "_self");
                      window.close();  
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>  
      </body>`;
  }
}

module.exports = new Order();
