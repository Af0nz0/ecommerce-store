const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const routes = require("./src/routes");
const db = require("./src/models");

const app = express();

// Configure Handlebars as the template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

// Use the routes middleware
app.use("/", routes);

// Sync database and start the server
db.sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
