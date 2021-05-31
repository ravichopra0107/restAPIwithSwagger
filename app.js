// imported libraries
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();
const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to database
mongoose.connect(
  "mongodb+srv://dbUser:" +
    process.env.PASSWORD +
    "@cluster0.fppfk.mongodb.net/restAPI?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// List Schema
const listSchema = {
  title: String,
  listBody: String,
};
// List model based on above schema
const List = mongoose.model("List", listSchema);

// POST request to add list into database
app.post("/add", (req, res) => {
  const newList = new List({
    title: req.body.title,
    listBody: req.body.listBody,
  });
  newList.save((err) => {
    if (!err) {
      res.send("Successfully added to DB");
    } else {
      res.send(err);
    }
  });
});

// GET request to retrieve lists from database
app.get("/getLists", (req, res) => {
  List.find({}, (err, lists) => {
    if (!err) {
      res.send(lists);
    } else {
      res.send(err);
    }
  });
});

// GET request to retrieve list from database by ID
app.get("/getByTitle/:title", (req, res) => {
  console.log(req.params.title);
  List.findOne({ title: req.params.title }, (err, list) => {
    if (!err) {
      res.send(list);
    } else {
      res.send(err);
    }
  });
});

// PUT request to updateBodyByTitle
app.put("/updateBodyByTitle", (req, res) => {
  List.findOne({ title: req.body.title }, (err, list) => {
    list.listBody = req.body.listBody;
    list.save((err) => {
      if (!err) {
        res.send("Successfully updated");
      } else {
        res.send(err);
      }
    });
  });
});

// DELETE request to deleteByTitle
app.delete("/deleteByTitle/:title", (req, res) => {
  List.deleteOne({ title: req.params.title }, (err) => {
    if (!err) {
      res.send("Successfully deleted");
    } else {
      res.send(err);
    }
  });
});

// Server listens on PORT(3000 for localhost)
app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening on 3000");
});

