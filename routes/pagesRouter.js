import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import getListsByBoardId from '../database/lists/read.js';
import getTasks from '../database/tasks/read.js';
import { getBoardsByUser, getBoardById } from '../database/boards/read.js';
import ensureLoggedIn from './middlewareRouter.js';


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

// Signup page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

// All boards (homepage after login)
router.get('/boards', ensureLoggedIn, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const boards = await getBoardsByUser(userId);
    res.render('boards', { boards, user: req.session.user });
  } catch {
    res.status(500).send('Internal Server Error');
  }
});

// Specific board view (kanban)
router.get('/boards/:id', ensureLoggedIn, async (req, res) => {
  try {
    const boardId = req.params.id;
    const board = await getBoardById(boardId);

    if (!board) {
      return res.status(404).send('Board not found');
    }

    const lists = await getListsByBoardId(boardId);
    const tasks = await getTasks(boardId);

    res.render('kanbanBoard', { board, lists, tasks, user: req.session.user });
  } catch {
    res.status(500).send('Internal Server Error');
  }
});


export default router;
