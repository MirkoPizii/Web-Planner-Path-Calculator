var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var debug = require('debug')('ppc:server');
var async = require("async");
var Tree = require("../models/tree");
var Nodo = require("../models/node");

var router = express.Router();

var ancestors = [], nodes = [], index = 0, node = {}, inserted = 0;

//Connect to Mongoose
mongoose.createConnection('mongodb://localhost:27017/ppc?socketTimeoutMS=60000000&connectTimeoutMS=60000000&poolSize=3&journal=false', {
  journal: false,
  server: {
    socketOptions: {
      connectionTimeoutMS: 600000000,
      socketTimeoutMS: 600000000
    }
  }
});

//var bulk = mongoose.connection.db.collection('nodes').initializeUnorderedBulkOp();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({"extended": false}));

//This function generates floating-point between two numbers low (inclusive) and high (exclusive) ([low, high))
var random = function(low, high) {
  var number = Math.random() * (high - low) + low;
  //console.log(number, low, high)
  return parseFloat(number).toFixed(2);
};

//This function generates random integer between two numbers low (inclusive) and high (exclusive) ([low, high))
var randomInt = function(low, high) {
  var number = Math.floor(Math.random() * (high - low) + low)
  //console.log(number, low, high)
  return number;
};

//GENERATE ATTRIBUTES VALUES FUNCTION
function setAttributesValues(list) {
  //list is the array of attributes
  var attributesValues = [];

  for (var i = 0, len = list.length; i < len; i++) {
    var obj = {};
    if (list[i].isInteger == 1) {
      obj.value = randomInt(list[i].k, list[i].n);
    } else {
      obj.value = random(list[i].k, list[i].n);
    }
    obj.name = list[i].name
    attributesValues.push(obj)
  }

  return attributesValues;
}
router.get("/test", function(req, res) {
  console.time("perf2")
  //res.json(mongoose.connection.server);
  //simulateMillions();
  simulateInsertR(0);
  //simulateInsert();
})
router.post("/", function(req, res) {
  console.time("perf")
  console.time("perf2")
  ancestors = [];
  index = 0;
  node = {};
  nodes.length = 0;
  inserted = 0;

  //NEW TREE
  var t = {
    "name": req.body.nameTree,
    "splitSize": req.body.splitSize,
    "depthSize": req.body.depthSize,
    "total": req.body.total,
    "creation": new Date(),
    "lastOperation": null
  };


  var vertecesAttributeList = [], edgesAttributeList = [];
  var isIntegerV = JSON.parse(req.body['isIntegerV[]']);
  var isIntegerE = JSON.parse(req.body['isIntegerE[]']);
  //ATTRIBUTES FOR NODES
  if (typeof req.body['vertexAttrName[]'] === 'string') {
    req.body['vertexAttrName[]'] = [req.body['vertexAttrName[]']];
  }
  if (typeof req.body['nValueVertex[]'] === 'string') {
    req.body['nValueVertex[]'] = [req.body['nValueVertex[]']];
  }
  if (typeof req.body['kValueVertex[]'] === 'string') {
    req.body['kValueVertex[]'] = [req.body['kValueVertex[]']];
  }
  for (var i = 0, len = req.body['vertexAttrName[]'].length; i < len; i++) {
    var temp = {};
    temp.name = req.body['vertexAttrName[]'][i];
    temp.ref = "Node";
    //per il momento la funzione di generazione valori ?? statica
    //temp.ref = req.body.vertexGenerationRule[i];
    temp.k = req.body['kValueVertex[]'][i];
    temp.n = req.body['nValueVertex[]'][i];
    temp.isInteger = isIntegerV[i];
    vertecesAttributeList.push(temp);

  }

  //ATTRIBUTES FOR EDGES
  if (typeof req.body['edgeAttrName[]'] === 'string') {
    req.body['edgeAttrName[]'] = [req.body['edgeAttrName[]']];
  }
  if (typeof req.body['kValueEdge[]'] === 'string') {
    req.body['kValueEdge[]'] = [req.body['kValueEdge[]']];
  }
  if (typeof req.body['nValueEdge[]'] === 'string') {
    req.body['nValueEdge[]'] = [req.body['nValueEdge[]']];
  }
  for (var i = 0, len = req.body['edgeAttrName[]'].length; i < len; i++) {
    var temp = {};
    temp.name = req.body['edgeAttrName[]'][i];
    temp.ref = "Edge";
    //per il momento la funzione di generazione valori ?? statica
    //temp.ref = req.body.vertexGenerationRule[i];
    temp.k = parseFloat(req.body['kValueEdge[]'][i]);
    temp.n = parseFloat(req.body['nValueEdge[]'][i]);
    temp.isInteger = isIntegerE[i];
    edgesAttributeList.push(temp);

  }
  t.vertecesAttributeList = vertecesAttributeList;
  t.edgesAttributeList = edgesAttributeList;
  //INSERT TREE
  Tree.createTree(t, function(err, data) {
    if (err) {
      throw err;
    }
    //console.log(data)
    t.id = data._id;
    res.json(t);

    //CREATE NODES
    console.log("building tree...")
    buildTree(0, t, t.splitSize, t.depthSize, 0, setAttributesValues(t.vertecesAttributeList), setAttributesValues(t.edgesAttributeList));

  })


  //res.json("ok");
});


//BUILDTREE FUNCTION
var buildTree = function buildTreeRecursive(key, albero, split, depth, k, vatt, eatt) {
  //console.log("chiamata ricorsiva: "+ key + " - nodes: " + nodes.length)
  if (nodes.length == 20000) {
    console.log("chiamata ricorsiva: " + key)
    Nodo.collection.insert(nodes.slice(0), {writeConcern: {wtimeout: 0}, ordered: false}, function(err) {

      if (err) {
        throw err;
      }
      inserted++;
      console.log("inserito: " + inserted)

    })
    nodes.length = 0;
  } else {
    nodes.push({
      "seq_number": key,
      "tree_id": albero.id,
      "name": "Vertex_" + key,
      "level": k,
      "attributes": vatt.slice(0),
      "edge": {
        "id_edge": "edge_" + key,
        "attributes": eatt.slice(0),

      },
      "ancestors": ancestors.slice(0)
    })
  }


  index++;
  //CASO FOGLIA
  if (k == depth) {
    if (index == albero.total) {
      console.timeEnd("perf")
      Nodo.collection.insert(nodes.slice(0), {writeConcern: {wtimeout: 0}, ordered: false}, function(err) {
        if (err) {
          throw err;
        }
        inserted++;
        console.log("last: " + inserted)
        console.timeEnd("perf2")
      })

    }
    return;
  }

  //CASO FIGLI
  //delete node.ancestors;
  //ancestors.push(node)
  ancestors.unshift({
    "seq_number": key,
    "name": "Vertex_" + key,
    "level": k,
    "attributes": vatt.slice(0),
    "edge": {
      "id_edge": "edge_" + key,
      "attributes": eatt.slice(0)
    }

  });
  for (var i = 0; i < split; i++) {
    buildTreeRecursive(index, albero, split, depth, k + 1, setAttributesValues(albero.vertecesAttributeList), setAttributesValues(albero.edgesAttributeList))
    if (i == split - 1) {
      //ancestors.pop();
      ancestors.shift()
    }
  }

}

/* GET users listing.
 router.get('/', function(req, res, next) {
 res.send('respond with a resource');
 });
 */


module.exports = router;