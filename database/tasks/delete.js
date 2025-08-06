import connectDB from "../connectionAtlas.js";
import { ObjectId } from "mongodb";

async function deleteTask(id) {
  const { tasks } = await connectDB();
  const result = await tasks.deleteOne({ _id: new ObjectId(id) });
  return result;
}

export default deleteTask;
