const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

/*
Modify Change Stream Output using Aggregation Pipelines
You can control change stream output by providing an array of one or more of the following pipeline stages when configuring the change stream:
$match, $project, $addFields, $replaceRoot, $redact
See Change Events for more information on the change stream response document format.
https://docs.mongodb.com/manual/reference/change-events/#change-stream-output
*/
const pipeline = [
  {
    $project: { documentKey: false }
  }
];

MongoClient.connect("mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=mongo-repl")
  .then(client => {
    console.log("Connected correctly to server");
    // specify db and collections
    const db = client.db("superheroesdb");
    const collection = db.collection("superheroes");

    const changeStream = collection.watch(pipeline);
    // start listen to changes
    changeStream.on("change", function (change) {
      console.log(change);
    });

    // insert few data with timeout so that we can watch it happening
    setTimeout(function () {
      collection.insertOne({ "batman": "bruce wayne" }, function (err) {
        assert.ifError(err);
      });
    }, 1000);
    
    setTimeout(function () {
      collection.insertOne({ "superman": "clark kent" }, function (err) {
        assert.ifError(err);
      });
    }, 2000);
    
    setTimeout(function () {
      collection.insertOne({ "wonder-woman": "diana prince" }, function (err) {
        assert.ifError(err);
      });
    }, 3000);
    
    setTimeout(function () {
      collection.insertOne({ "ironman": "tony stark" }, function (err) {
        assert.ifError(err);
      });
    }, 4000);
    
    setTimeout(function () {
      collection.insertOne({ "spiderman": "peter parker" }, function (err) {
        assert.ifError(err);
      });
    }, 5000);
    
    // update existing document
    setTimeout(function () {
      collection.updateOne({ "ironman": "tony stark" }, { $set: { "ironman": "elon musk" } }, function (err) {
        assert.ifError(err);
      });
    }, 6000);
    
    // delete existing document
    setTimeout(function () {
      collection.deleteOne({ "spiderman": "peter parker" }, function (err) {
        assert.ifError(err);
      });
    }, 7000);
  })
  .catch(err => {
    console.error(err);
  });