import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function getListsByBoardId(boardId) {
  const { lists } = await connectDB();
  return lists
    .find({ boardId: new ObjectId(boardId) })
    .sort({ order: 1 })
    .toArray();
}

export default getListsByBoardId;
