import express from 'express';
import session from 'express-session';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

import pagesRouter from './routes/pagesRouter.js';
app.use(pagesRouter);

import authRouter from './routes/authRouter.js';
app.use('/api', authRouter);

import tasksRouter from './routes/tasksRouter.js';
app.use('/api', tasksRouter);

import listRouter from './routes/listRouter.js';
app.use('/api', listRouter);

import boardRouter from './routes/boardRouter.js';
app.use ('/api', boardRouter)


const server = http.createServer(app);

const io = new Server(server);


import initSocketIO from './sockets/io.js';
initSocketIO(io);


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log("Server is running on port", PORT));
