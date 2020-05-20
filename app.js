const express = require("express");
// eslint-disable-next-line import/order
const keys = require("./config/keys");
const stripe = require("stripe")(keys.stripeSecretKey);

const exphbs = require("express-handlebars");

const app = express();

// Handlebars middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Set static Folder
app.use(express.static(`${__dirname}/public`));
// Index Route
app.get("/", (req, res) => {
  res.render("index", { stripePublishableKey: keys.stripePublishableKey });
});
// CHarge Route
app.post("/charge", (req, res) => {
  const amount = 1500;
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) =>
      stripe.charges.create({
        amount,
        description: "Learn JS Ebook",
        currency: "eur",
        customer: customer.id,
      })
    )
    .then((charge) => res.render("success"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
