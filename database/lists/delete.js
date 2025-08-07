import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function deleteList(id, boardId) {
  const { lists } = await connectDB();
  const result = await lists.deleteOne({
    _id: new ObjectId(id),
    boardId: new ObjectId(boardId),
  });
  return result.deletedCount === 1;
}

export default deleteList;
