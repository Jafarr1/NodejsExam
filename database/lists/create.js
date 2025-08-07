import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function createList({ title, order, boardId }) {
  const { lists } = await connectDB();

  const count = await lists.countDocuments({ boardId: new ObjectId(boardId) });

  const result = await lists.insertOne({
    title,
    order: count,
    boardId: new ObjectId(boardId),
  });

  return {
    _id: result.insertedId,
    title,
    order: count,
    boardId: new ObjectId(boardId),
  };
}

export default createList;
