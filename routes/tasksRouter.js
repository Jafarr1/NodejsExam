import { Router } from 'express';
import createTask from '../database/tasks/create.js';
import getTasks from '../database/tasks/read.js';
import updateTask from '../database/tasks/update.js';
import deleteTask from '../database/tasks/delete.js';

const router = Router();

// GET all tasks for a board
router.get('/boards/:boardId/tasks', async (req, res) => {
  const { boardId } = req.params;
  try {
    const tasks = await getTasks({ boardId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create a task in a board
router.post('/boards/:boardId/tasks', async (req, res) => {
  const { boardId } = req.params;
  const newTask = { ...req.body, boardId };
  try {
    const result = await createTask(newTask);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update a task
router.put('/boards/:boardId/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  // optionally check boardId here if needed
  try {
    const result = await updateTask(id, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/boards/:boardId/tasks/:id', async (req, res) => {
  const { id } = req.params;
  // optionally check boardId here if needed
  try {
    const result = await deleteTask(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


export default router;
