import connectDB from "../connectionAtlas.js";
import { ObjectId } from "mongodb";

async function deleteBoard(boardId) {
  const { boards, lists, tasks } = await connectDB();

  const boardObjectId = new ObjectId(boardId);

  await lists.deleteMany({ boardId: boardObjectId });
  await tasks.deleteMany({ boardId: boardObjectId });

  const result = await boards.deleteOne({ _id: boardObjectId });
  return result.deletedCount === 1;
}

export default deleteBoard;
