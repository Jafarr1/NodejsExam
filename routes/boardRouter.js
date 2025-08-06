import { Router } from 'express';
import createBoard from '../database/boards/create.js';
import deleteBoard from '../database/boards/delete.js';
import { getUserByUsername } from '../database/users.js';
import  {updateBoard, addMemberToBoard  } from '../database/boards/update.js';
import { getBoardsByUser, getBoardById } from '../database/boards/read.js';

const router = Router();


function getUserId(req) {
  return req.session?.user?.id || null;
}

// GET all boards for current user
router.get('/boards', async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });
    const boards = await getBoardsByUser(userId);
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// GET single board
router.get('/boards/:id', async (req, res) => {
  try {
    const board = await getBoardById(req.params.id);
    if (!board) return res.status(404).json({ error: 'Board not found' });
    res.json(board);
  } catch {
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// POST create new board
router.post('/boards', async (req, res) => {
  try {
    const ownerId = getUserId(req);
    console.log('Creating board for user:', ownerId);

    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const board = await createBoard({ title, ownerId });
    console.log('Board created:', board);
    res.status(201).json(board);
  } catch (error) {
    console.error('Error creating board:', error);  // <=== Log the error here
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// POST invite/add a member to a board by username (or userId)
router.post('/boards/:id/members', async (req, res) => {
  try {
    const boardId = req.params.id;
    console.log('Invite request for boardId:', boardId);
    const { memberId: username } = req.body; // it's a username being passed

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await getUserByUsername(username); // ✅ using SQLite here

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

        const board = await getBoardById(boardId);
    console.log('Fetched board before update:', board);

    // MongoDB might expect an ObjectId — make sure you handle that if needed
    const updatedBoard = await addMemberToBoard(boardId, user.id); // ✅ user.id from SQLite
    console.log('Updated board:', updatedBoard);

    if (!updatedBoard) {
      console.log('Board not found after update! Sending 404');
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(updatedBoard);
  } catch (error) {
    console.error('Failed to add member:', error);
    res.status(500).json({ error: 'Failed to add member to board' });
  }
});



// PUT update board (rename, etc.)
router.put('/boards/:id', async (req, res) => {
  try {
    const updatedBoard = await updateBoard(req.params.id, req.body);
    if (!updatedBoard) return res.status(404).json({ error: 'Board not found' });
    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// DELETE board (and lists/tasks under it)
router.delete('/boards/:id', async (req, res) => {
  try {
    const success = await deleteBoard(req.params.id);
    if (!success) return res.status(404).json({ error: 'Board not found' });
    res.json({ message: 'Board deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

export default router;
