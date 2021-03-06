var mongoose = require("mongoose");
//mongoose.connect('mongodb://localhost:27017/ppc');
// create instance of Schema
var Schema = mongoose.Schema;

// create Tree schema
var treeSchema = new Schema({
  name: String,
  splitSize: Number,
  depthSize: Number,
  total: Number,
  vertecesAttributeList: Array,
  edgesAttributeList: Array,
  creation: {
    type: Date,
    default: Date.now
  },
  creation_time: String
});

// create model if not exists.
var Tree = mongoose.model('Tree', treeSchema);

// make this available to our users in our Node applications
module.exports = Tree;

// CREATE TREE
module.exports.createTree = function(albero, callback) {
  Tree.create(albero, callback)
}

// GET TREES
module.exports.getTrees = function(callback) {
  Tree.find(callback)
  //Tree.find(callback).limit(limit)
}

// GET TREES
module.exports.countTrees = function(callback) {
  Tree.count(callback)
}

// GET TREE BY ID
module.exports.getTreeById = function(id, callback) {
  Tree.findById(id, callback)
}

// DELETE TREE BY ID
module.exports.deleteTreeById = function(id, callback) {
  Tree.find({
    _id: id
  }).remove().exec();
}



