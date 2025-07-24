import "dotenv/config";
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@kanbancluster.j8uctzi.mongodb.net/?retryWrites=true&w=majority&appName=KanbanCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    db = client.db("kanbanDB");
  }

  return {
    tasks: db.collection("tasks"),
    users: db.collection("users"),
    
    // Add more collections if needed
  };
}

export default connectDB;
