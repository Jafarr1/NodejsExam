import { Router } from 'express';
import createList from '../database/lists/create.js';
import getLists from '../database/lists/read.js';
import updateList from '../database/lists/update.js';
import deleteList from '../database/lists/delete.js';

const router = Router();

// GET all lists in a board
router.get('/boards/:boardId/lists', async (req, res) => {
  try {
    const { boardId } = req.params;
    const lists = await getLists(boardId);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lists' });
  }
});

// POST create a list in a board
router.post('/boards/:boardId/lists', async (req, res) => {
  try {
    const { boardId } = req.params;
    const newList = { ...req.body, boardId };
    const result = await createList(newList);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create list' });
  }
});

// PUT reorder lists in a board
router.put('/boards/:boardId/lists/reorder', async (req, res) => {
  try {
    const updatedLists = req.body;
    await Promise.all(
      updatedLists.map(({ id, order }) => updateList(id, { order }))
    );
    res.json({ message: 'Lists reordered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reorder lists' });
  }
});

// PUT update a specific list
router.put('/boards/:boardId/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const result = await updateList(id, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update list' });
  }
});

// DELETE a list from a board
router.delete('/boards/:boardId/lists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteList(id);
    if (success) {
      res.json({ message: 'List deleted' });
    } else {
      res.status(404).json({ error: 'List not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

export default router;
