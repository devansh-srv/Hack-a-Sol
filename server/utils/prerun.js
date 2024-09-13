const {MongoClient} = require('mongodb')

function connectMongoDB(){
  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri);
  const db = client.db('hardcode');
  console.log("Connected to MongoDB");
  return db;
}

module.exports = {
  connectMongoDB: connectMongoDB,
};
