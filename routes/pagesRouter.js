
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the login page
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/login.html'));
});

// Serve the signup page
router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/signup.html'));
});

router.get('/kanbanBoard', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/html/kanbanBoard.html'));
});

export default router;
