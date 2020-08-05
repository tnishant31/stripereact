const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(process.env.REACT_APP_SECRET_KEY);
const uuid = require("uuid/v4");

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Its online");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product ", product);
  console.log("Price ", product.price);

  const idempotencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.source,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purcahse of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(8282, () => console.log("LISTENING on port 8282"));
