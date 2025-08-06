import connectDB from "../connectionAtlas.js";
import { ObjectId } from "mongodb";

async function getBoardsByUser(userId) {
  const { boards } = await connectDB();
  return await boards.find({ members: String(userId) }).toArray();
}

async function getBoardById(boardId) {
  const { boards } = await connectDB();
  return await boards.findOne({ _id: new ObjectId(boardId) });
}

export { getBoardsByUser, getBoardById };
