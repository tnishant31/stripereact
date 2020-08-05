import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";

import logo from "./logo.svg";
import "./App.css";

function App() {
  const [product, setProduct] = useState({
    name: "React from facebook",
    price: 51,
    productBy: "Facebook",
  });

  const makePayment = (token) => {
    const body = {
      token,
      product,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`https//localhost:8282/payment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = response;
        console.log("STATUS", status);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <a
          className="App-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_SECRET_KEY}
          token={makePayment}
          name="Buy React"
          amount={product.price * 100}
          shippingAddress
          billingAddress
        >
          <button className="btn btn-large orange">
            Buy React in just ${product.price}
          </button>
        </StripeCheckout>
      </header>
    </div>
  );
}

export default App;
