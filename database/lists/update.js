import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function updateList(id, boardId, updates) {
  const { lists } = await connectDB();
  const result = await lists.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      boardId: new ObjectId(boardId),
    },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result;
}

export default updateList;
