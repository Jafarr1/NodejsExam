import connectDB from "../connectionAtlas.js";

async function createBoard(board) {
  const { boards } = await connectDB();

  const userId = String(board.ownerId); // convert to string for MongoDB

const result = await boards.insertOne({
  title: board.title,
  ownerId: String(board.ownerId),
  members: [String(board.ownerId)],
  createdAt: new Date(),
});

  return { _id: result.insertedId, title: board.title, ownerId: userId, members: [userId], createdAt: new Date() };
}

export default createBoard;
