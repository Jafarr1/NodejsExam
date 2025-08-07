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
    res.json({ data: boards});
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch boards' });
  }
});

// GET single board
router.get('/boards/:id', async (req, res) => {
  try {
    const board = await getBoardById(req.params.id);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    res.json({ data: board });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch board' });
  }
});

// POST create new board
router.post('/boards', async (req, res) => {
  try {
    const ownerId = getUserId(req);
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const board = await createBoard({ title, ownerId });
    res.status(201).json({ data: board });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create board' });
  }
});

// POST invite/add a member to a board by username
router.post('/boards/:id/members', async (req, res) => {
  try {
    const boardId = req.params.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const board = await getBoardById(boardId);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    const updatedBoard = await addMemberToBoard(boardId, user.id);
    res.status(201).json({ data: updatedBoard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member to board' });
  }
});



// PUT update board (rename, etc.)
router.put('/boards/:id', async (req, res) => {
  try {
    const updatedBoard = await updateBoard(req.params.id, req.body);

    if (!updatedBoard) {
      return res.status(404).json({ error: 'Board not found' });
    }

  res.json({ data: updatedBoard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update board' });
  }
});

// DELETE board (and lists/tasks under it)
router.delete('/boards/:id', async (req, res) => {
  try {
    const success = await deleteBoard(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete board' });
  }
});

export default router;
