import connectDB from "../connectionAtlas.js";
import { ObjectId } from "mongodb";

async function updateTask(id, updatedFields) {
  const { tasks } = await connectDB();
  const result = await tasks.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedFields }
  );
  return result;
}

export default updateTask;
