import express from 'express';
import session from 'express-session';
import 'dotenv/config';



const app = express();

app.use(express.json());


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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));
