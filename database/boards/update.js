import connectDB from "../connectionAtlas.js";
import { ObjectId } from "mongodb";

async function updateBoard(boardId, updates) {
  const { boards } = await connectDB();
  const result = await boards.findOneAndUpdate(
    { _id: new ObjectId(boardId) },
    { $set: updates },
    { returnDocument: 'after' }
  );
  return result.value;
}

async function addMemberToBoard(boardId, memberId) {
  const { boards } = await connectDB();

  const result = await boards.findOneAndUpdate(
    { _id: new ObjectId(boardId) },
    { $addToSet: { members: String(memberId) } },
    { returnDocument: 'after' }
  );

  console.log('findOneAndUpdate full result:', result);       // The whole object
  const updatedDoc = result.value || result;

  console.log('Resolved updated document:', updatedDoc);

  return updatedDoc;
}


export { updateBoard, addMemberToBoard };
