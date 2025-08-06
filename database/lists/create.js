import connectDB from "../connectionAtlas.js";
import { ObjectId } from 'mongodb';

async function createList({ title, order, boardId }) {
  const { lists } = await connectDB();

  const result = await lists.insertOne({
    title,
    order,
    boardId: new ObjectId(boardId),
    createdAt: new Date(),
  });

  return {
    _id: result.insertedId,
    title,
    order,
    boardId: new ObjectId(boardId),
  };
}

export default createList;
