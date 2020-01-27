const { resolvers } = require("./Resolvers/resolvers");
const express_graphql = require("express-graphql");
const { schema } = require("./Requests/requests");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors")
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@rishi-cluster-shard-00-00-3l7u9.mongodb.net:27017,rishi-cluster-shard-00-01-3l7u9.mongodb.net:27017,rishi-cluster-shard-00-02-3l7u9.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=rishi-cluster-shard-0&authSource=admin&retryWrites=true&w=majority`,
    {useNewUrlParser: true,useUnifiedTopology: true}
  )
  .then(() => {
    app.listen(4000);
    console.log("Connected to cloud:");
  })
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
