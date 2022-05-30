//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://bobchm:monkeyhead@cluster0.4c99z.mongodb.net/todolistDB");

const topLevelList = "Today";
var activeList = topLevelList;

const itemsSchema = new mongoose.Schema({
  name: String,
  list: String
});

const Item = mongoose.model("Item", itemsSchema);

app.get("/", function (req, res) {
  Item.find({ list: activeList }, function (err, items) {
    if (err) {
      console.log(err);
    } else {
      res.render("list", { listTitle: activeList, newListItems: items });
    }
  });
});

app.get("/list", function (req, res) {
  console.log(req.query.name);
  if (req.query.name) {
    activeList = req.query.name;  
    res.redirect("/");
  }
});

app.post("/", function(req, res) {

  const itemName = req.body.newItem;

  if (itemName.length > 0) {
    const item = Item(({
      name: itemName,
      list: activeList
    }));
    item.save();
    res.redirect("/");
  }
});

app.post("/delete", function(req, res) {
  Item.findByIdAndRemove(req.body.checkbox, function(err){
    if (err) {
      console.log("Error removing item.");
    } else {
      res.redirect("/");
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});
