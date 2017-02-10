var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var app = express();
var router = express.Router();

var Tree = require("../models/tree");
var Node = require("../models/node")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": false}));

router.get("/", function(req, res) {
  Tree.getTrees(function(err, trees) {
    if (err) {
      throw err;
    }
    res.json({
      trees: trees,
      page: req.query.page,
      limit: req.query.limit
    })
  })
});

router.get("/count", function(req, res) {
  Tree.countTrees(function(err, data) {
    if (err) {
      throw err;
    }
    res.json(data)
  })
});

router.get("/:id", function(req, res) {
  Tree.getTreeById(req.params.id, function(err, tree) {
    if (err) {
      throw err;
    }
    res.json(tree)
  })
});

router.delete("/", function(req, res) {
  Tree.find({
    _id: req.body['id_tree']
  }).remove().exec();
  Node.find({
    tree_id: req.body['id_tree']
  }).remove().exec();
  res.json('Done!')
});

/* GET users listing. 
 router.get('/', function(req, res, next) {
 res.send('respond with a resource');
 });
 */


module.exports = router;