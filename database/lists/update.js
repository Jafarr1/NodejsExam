import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function updateList(id, updates) {
  const { lists } = await connectDB();

  const result = await lists.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result.value;
}

export default updateList;
