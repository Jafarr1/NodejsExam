import connectDB from '../connectionAtlas.js';

async function createTask(task) {
  const { tasks } = await connectDB();
  const result = await tasks.insertOne(task);
  return { 
    ...task,
    _id: result.insertedId.toString()
  };
}


export default createTask;