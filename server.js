const express = require("express");
const cors = require('cors');
const express_graphql = require("express-graphql");
const bodyParser = require("body-parser");
const app = express();
const {schema} = require ('./Requests/requests')
const {resolvers} = require ('./Resolvers/resolvers');
const mongoDb = require('mongoose');
app.use(bodyParser.json());
app.use(cors());

mongoDb
  .connect("mongodb://localhost:27017/rishi")
  .then(console.log("connected to db:"), app.listen(4000))
  .catch(err => {
    console.log(err);
  });

app.use(
  "/graphql",
  express_graphql({
    schema: schema,
    rootValue: resolvers,
    graphiql: true
  })
);
