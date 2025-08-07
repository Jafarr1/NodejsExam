import { Router } from 'express';
import createTask from '../database/tasks/create.js';
import getTasks from '../database/tasks/read.js';
import updateTask from '../database/tasks/update.js';
import deleteTask from '../database/tasks/delete.js';

const router = Router();

// GET all tasks for a board
router.get('/boards/:boardId/tasks', async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await getTasks({ boardId });
    res.json({ data: tasks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create a task in a board
router.post('/boards/:boardId/tasks', async (req, res) => {
  try {
    const { boardId } = req.params;
    const newTask = { ...req.body, boardId };
    const createdTask = await createTask(newTask);
    res.status(201).json({ data: createdTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update a task
router.put('/boards/:boardId/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedTask = await updateTask(id, updates);

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ data: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/boards/:boardId/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await deleteTask(id);

        if (!success) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});


export default router;
