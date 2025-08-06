import connectDB from "../connectionAtlas.js";

async function getAllTasks() {
  const { tasks } = await connectDB();
  const result = await tasks.find().toArray();
  return result;
}

export default getAllTasks;
